const { query } = require('../config/database');
const { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  formatUserResponse 
} = require('../utils/helpers');

const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
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
       VALUES ($1, $2, $3, $4, 'user') 
       RETURNING id, name, email, address, role, created_at`,
      [name, email, hashedPassword, address]
    );
    const user = result.rows[0];
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: formatUserResponse(user),
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await query(
      'SELECT id, name, email, password, address, role FROM users WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    const user = result.rows[0];
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    const token = generateToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: formatUserResponse(user),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const result = await query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    const isCurrentPasswordValid = await comparePassword(
      currentPassword, 
      result.rows[0].password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    const hashedNewPassword = await hashPassword(newPassword);
    await query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedNewPassword, userId]
    );
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update password'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updatePassword
};
