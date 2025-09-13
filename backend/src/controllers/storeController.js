const { query } = require('../config/database');
const { getPagination, sanitizeSortParams } = require('../utils/helpers');

const getAllStores = async (req, res) => {
  try {
    const { 
      page = 0, 
      size = 10, 
      search = '', 
      sort = 'created_at:DESC' 
    } = req.query;

    const { limit, offset } = getPagination(parseInt(page), parseInt(size));
    const { field, order } = sanitizeSortParams(sort, [
      'name', 'email', 'address', 'average_rating', 'created_at'
    ]);

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND (LOWER(s.name) LIKE LOWER($${paramIndex}) OR LOWER(s.address) LIKE LOWER($${paramIndex}))`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const countResult = await query(
      `SELECT COUNT(*) as total FROM stores s ${whereClause}`,
      params
    );
    const totalItems = parseInt(countResult.rows[0].total);

    let storeQuery;
    if (req.user) {
      storeQuery = `
        SELECT s.id, s.name, s.email, s.address, s.average_rating, s.total_ratings, 
               s.created_at, s.updated_at,
               r.rating as user_rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id AND r.user_id = $${paramIndex}
        ${whereClause}
        ORDER BY s.${field} ${order}
        LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}`;
      params.push(req.user.id, limit, offset);
    } else {
      storeQuery = `
        SELECT s.id, s.name, s.email, s.address, s.average_rating, s.total_ratings,
               s.created_at, s.updated_at
        FROM stores s
        ${whereClause}
        ORDER BY s.${field} ${order}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);
    }

    const result = await query(storeQuery, params);

    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      success: true,
      data: {
        stores: result.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stores'
    });
  }
};

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    let storeQuery;
    const params = [id];

    if (req.user) {
      storeQuery = `
        SELECT s.id, s.name, s.email, s.address, s.average_rating, s.total_ratings,
               s.created_at, s.updated_at,
               r.rating as user_rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id AND r.user_id = $2
        WHERE s.id = $1`;
      params.push(req.user.id);
    } else {
      storeQuery = `
        SELECT s.id, s.name, s.email, s.address, s.average_rating, s.total_ratings,
               s.created_at, s.updated_at
        FROM stores s
        WHERE s.id = $1`;
    }

    const result = await query(storeQuery, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    res.json({
      success: true,
      data: {
        store: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Get store by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store'
    });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    const existingStore = await query(
      'SELECT id FROM stores WHERE email = $1',
      [email]
    );

    if (existingStore.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Store already exists with this email'
      });
    }

    if (owner_id) {
      const ownerResult = await query(
        'SELECT id, role FROM users WHERE id = $1',
        [owner_id]
      );

      if (ownerResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Owner user not found'
        });
      }

      if (ownerResult.rows[0].role !== 'store_owner') {
        return res.status(400).json({
          success: false,
          message: 'User must have store_owner role to own a store'
        });
      }
    }

    const result = await query(
      `INSERT INTO stores (name, email, address, owner_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, address, owner_id, average_rating, total_ratings, created_at`,
      [name, email, address, owner_id || null]
    );

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: {
        store: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create store'
    });
  }
};

const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, owner_id } = req.body;

    const storeResult = await query(
      'SELECT id, owner_id FROM stores WHERE id = $1',
      [id]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const currentStore = storeResult.rows[0];

    if (req.user.role !== 'admin' && req.user.id !== currentStore.owner_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (name) {
      updates.push(`name = $${paramIndex}`);
      params.push(name);
      paramIndex++;
    }

    if (email) {
      const emailExists = await query(
        'SELECT id FROM stores WHERE email = $1 AND id != $2',
        [email, id]
      );

      if (emailExists.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Email is already taken'
        });
      }

      updates.push(`email = $${paramIndex}`);
      params.push(email);
      paramIndex++;
    }

    if (address) {
      updates.push(`address = $${paramIndex}`);
      params.push(address);
      paramIndex++;
    }

    if (owner_id !== undefined && req.user.role === 'admin') {
      if (owner_id) {
        const ownerResult = await query(
          'SELECT id, role FROM users WHERE id = $1',
          [owner_id]
        );

        if (ownerResult.rows.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Owner user not found'
          });
        }

        if (ownerResult.rows[0].role !== 'store_owner') {
          return res.status(400).json({
            success: false,
            message: 'User must have store_owner role to own a store'
          });
        }
      }

      updates.push(`owner_id = $${paramIndex}`);
      params.push(owner_id);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const result = await query(
      `UPDATE stores 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, name, email, address, owner_id, average_rating, total_ratings, updated_at`,
      params
    );

    res.json({
      success: true,
      message: 'Store updated successfully',
      data: {
        store: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update store'
    });
  }
};

const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const storeExists = await query(
      'SELECT id FROM stores WHERE id = $1',
      [id]
    );

    if (storeExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    await query('DELETE FROM stores WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Store deleted successfully'
    });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete store'
    });
  }
};

const getStoreRatings = async (req, res) => {
  try {
    const { id } = req.params;

    const storeResult = await query(
      'SELECT id, name, owner_id, average_rating FROM stores WHERE id = $1',
      [id]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const store = storeResult.rows[0];
    if (req.user.role !== 'admin' && req.user.id !== store.owner_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const ratingsResult = await query(
      `SELECT r.id, r.rating, r.created_at, r.updated_at,
              u.id as user_id, u.name as user_name, u.email as user_email
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = $1
       ORDER BY r.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      data: {
        store: {
          id: store.id,
          name: store.name,
          average_rating: store.average_rating
        },
        ratings: ratingsResult.rows
      }
    });
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store ratings'
    });
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getStoreRatings
};
