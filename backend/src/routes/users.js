const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidationErrors, sanitizeInput } = require('../middleware/validation');
const { 
  validateName, 
  validateEmail, 
  validateAddress, 
  validateRole 
} = require('../utils/validation');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getDashboardStats
} = require('../controllers/userController');

const router = express.Router();

router.get('/dashboard-stats', 
  authenticate, 
  authorize('admin'), 
  getDashboardStats
);

router.get('/', 
  authenticate, 
  authorize('admin'), 
  getAllUsers
);

router.get('/:id', 
  authenticate, 
  getUserById
);

router.post('/', [
  authenticate,
  authorize('admin'),
  sanitizeInput,
  validateName,
  validateEmail,
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('Password must contain at least one uppercase letter and one special character'),
  validateAddress,
  validateRole,
  handleValidationErrors
], createUser);

router.put('/:id', [
  authenticate,
  sanitizeInput,
  validateName.optional(),
  validateEmail.optional(),
  validateAddress.optional(),
  validateRole.optional(),
  handleValidationErrors
], updateUser);

router.delete('/:id', 
  authenticate, 
  authorize('admin'), 
  deleteUser
);

module.exports = router;