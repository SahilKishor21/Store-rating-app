const { body } = require('express-validator');

const validateName = body('name')
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters')
  .trim()
  .escape();

const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email address');

const validatePassword = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be between 8 and 16 characters')
  .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
  .withMessage('Password must contain at least one uppercase letter and one special character');

const validateAddress = body('address')
  .optional()
  .isLength({ max: 400 })
  .withMessage('Address must not exceed 400 characters')
  .trim()
  .escape();

const validateRole = body('role')
  .isIn(['admin', 'user', 'store_owner'])
  .withMessage('Role must be admin, user, or store_owner');

const validateRating = body('rating')
  .isInt({ min: 1, max: 5 })
  .withMessage('Rating must be an integer between 1 and 5');

const validateStoreName = body('name')
  .isLength({ min: 1, max: 100 })
  .withMessage('Store name must be between 1 and 100 characters')
  .trim()
  .escape();

const validateStoreEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid store email address');

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
  validateRole,
  validateRating,
  validateStoreName,
  validateStoreEmail,
  userValidation: [validateName, validateEmail, validatePassword, validateAddress],
  loginValidation: [validateEmail, validatePassword],
  storeValidation: [validateStoreName, validateStoreEmail, validateAddress],
  ratingValidation: [validateRating]
};