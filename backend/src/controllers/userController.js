const { query } = require('../config/database');
const { 
  hashPassword, 
  formatUserResponse, 
  getPagination, 
  sanitizeSortParams 
} = require('../utils/helpers');

const getAllUsers = async (req, res) => {
  try {
    const { 
      page = 0, 
      size = 10, 
      search = '', 
      role = '', 
      sort = 'created_at:DESC' 
    } = req.query;

    const { limit, offset } = getPagination(parseInt(page), parseInt(size));
    const { field, order } = sanitizeSortParams(sort, [
      'name', 'email', 'address', 'role', 'created_at'
    ]);

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND (LOWER(name) LIKE LOWER($${paramIndex}) OR LOWER(email) LIKE LOWER($${paramIndex}) OR LOWER(address) LIKE LOWER($${paramIndex}))`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (role) {
      whereClause += ` AND role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }

    const countResult = await query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );
    const totalItems = parseInt(countResult.rows[0].total);

    const result = await query(
      `SELECT id, name, email, address, role, created_at, updated_at 
       FROM users 
       ${whereClause}
       ORDER BY ${field} ${order}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      success: true,
      data: {
        users: result.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT u.id, u.name, u.email, u.address, u.role, u.created_at, u.updated_at,
              CASE WHEN u.role = 'store_owner' THEN s.average_rating ELSE NULL END as rating
       FROM users u
       LEFT JOIN stores s ON u.id = s.owner_id
       WHERE u.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role = 'user' } = req.body;

    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const hashedPassword = await hashPassword(password);

    const result = await query(
      `INSERT INTO users (name, email, password, address, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, address, role, created_at`,
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: formatUserResponse(result.rows[0])
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, role } = req.body;

    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const userExists = await query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
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
        'SELECT id FROM users WHERE email = $1 AND id != $2',
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

    if (address !== undefined) {
      updates.push(`address = $${paramIndex}`);
      params.push(address);
      paramIndex++;
    }

    if (role && req.user.role === 'admin') {
      updates.push(`role = $${paramIndex}`);
      params.push(role);
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
      `UPDATE users 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, name, email, address, role, updated_at`,
      params
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: formatUserResponse(result.rows[0])
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userExists = await query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await query('DELETE FROM users WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [usersResult, storesResult, ratingsResult] = await Promise.all([
      query('SELECT COUNT(*) as total FROM users'),
      query('SELECT COUNT(*) as total FROM stores'),
      query('SELECT COUNT(*) as total FROM ratings')
    ]);

    res.json({
      success: true,
      data: {
        totalUsers: parseInt(usersResult.rows[0].total),
        totalStores: parseInt(storesResult.rows[0].total),
        totalRatings: parseInt(ratingsResult.rows[0].total)
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getDashboardStats
};
