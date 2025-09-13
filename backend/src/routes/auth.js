const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { handleValidationErrors, sanitizeInput } = require('../middleware/validation');
const { 
  validateName, 
  validateEmail, 
  validatePassword, 
  validateAddress 
} = require('../utils/validation');
const {
  register,
  login,
  getProfile,
  updatePassword
} = require('../controllers/authController');

const router = express.Router();

router.post('/test-login', async (req, res) => {
  try {
    console.log('Test login attempt:', req.body);
    
    const { email, password } = req.body;
    const { query } = require('../config/database');
    const result = await query(
      'SELECT id, name, email, password, address, role FROM users WHERE email = $1',
      [email]
    );
    
    console.log('User found:', result.rows.length > 0);
    
    if (result.rows.length === 0) {
      return res.json({ success: false, message: 'User not found' });
    }
    
    const user = result.rows[0];
    console.log('User data:', { id: user.id, email: user.email, role: user.role });
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.json({ success: false, message: 'Invalid password' });
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          address: user.address
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Test login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/register', [
  sanitizeInput,
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
  handleValidationErrors
], register);

router.post('/login', [
  sanitizeInput,
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
], login);

router.get('/profile', authenticate, getProfile);

router.put('/password', [
  authenticate,
  sanitizeInput,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('New password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('New password must contain at least one uppercase letter and one special character'),
  handleValidationErrors
], updatePassword);

module.exports = router;