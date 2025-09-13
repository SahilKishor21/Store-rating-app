const { query } = require('../config/database');

const submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    const storeExists = await query(
      'SELECT id FROM stores WHERE id = $1',
      [store_id]
    );

    if (storeExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const existingRating = await query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [user_id, store_id]
    );

    let result;
    let message;

    if (existingRating.rows.length > 0) {
      result = await query(
        `UPDATE ratings 
         SET rating = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = $2 AND store_id = $3 
         RETURNING id, rating, created_at, updated_at`,
        [rating, user_id, store_id]
      );
      message = 'Rating updated successfully';
    } else {
      result = await query(
        `INSERT INTO ratings (user_id, store_id, rating) 
         VALUES ($1, $2, $3) 
         RETURNING id, rating, created_at, updated_at`,
        [user_id, store_id, rating]
      );
      message = 'Rating submitted successfully';
    }

    res.json({
      success: true,
      message,
      data: {
        rating: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit rating'
    });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { page = 0, size = 10 } = req.query;

    const limit = parseInt(size);
    const offset = parseInt(page) * limit;

    const countResult = await query(
      'SELECT COUNT(*) as total FROM ratings WHERE user_id = $1',
      [user_id]
    );
    const totalItems = parseInt(countResult.rows[0].total);

    const result = await query(
      `SELECT r.id, r.rating, r.created_at, r.updated_at,
              s.id as store_id, s.name as store_name, s.address as store_address
       FROM ratings r
       JOIN stores s ON r.store_id = s.id
       WHERE r.user_id = $1
       ORDER BY r.updated_at DESC
       LIMIT $2 OFFSET $3`,
      [user_id, limit, offset]
    );

    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      success: true,
      data: {
        ratings: result.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user ratings'
    });
  }
};

const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const ratingResult = await query(
      'SELECT id, user_id FROM ratings WHERE id = $1',
      [id]
    );

    if (ratingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    const rating = ratingResult.rows[0];

    if (req.user.role !== 'admin' && rating.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await query('DELETE FROM ratings WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete rating'
    });
  }
};

const getAllRatings = async (req, res) => {
  try {
    const { page = 0, size = 10, store_id, user_id } = req.query;

    const limit = parseInt(size);
    const offset = parseInt(page) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (store_id) {
      whereClause += ` AND r.store_id = $${paramIndex}`;
      params.push(store_id);
      paramIndex++;
    }

    if (user_id) {
      whereClause += ` AND r.user_id = $${paramIndex}`;
      params.push(user_id);
      paramIndex++;
    }

    const countResult = await query(
      `SELECT COUNT(*) as total FROM ratings r ${whereClause}`,
      params
    );
    const totalItems = parseInt(countResult.rows[0].total);

    const result = await query(
      `SELECT r.id, r.rating, r.created_at, r.updated_at,
              s.id as store_id, s.name as store_name,
              u.id as user_id, u.name as user_name, u.email as user_email
       FROM ratings r
       JOIN stores s ON r.store_id = s.id
       JOIN users u ON r.user_id = u.id
       ${whereClause}
       ORDER BY r.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      success: true,
      data: {
        ratings: result.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Get all ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ratings'
    });
  }
};

module.exports = {
  submitRating,
  getUserRatings,
  deleteRating,
  getAllRatings
};
