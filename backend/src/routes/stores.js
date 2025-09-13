const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { handleValidationErrors, sanitizeInput } = require('../middleware/validation');
const { 
  validateStoreName, 
  validateStoreEmail, 
  validateAddress 
} = require('../utils/validation');
const {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getStoreRatings
} = require('../controllers/storeController');

const router = express.Router();

router.get('/', optionalAuth, getAllStores);

router.get('/:id', optionalAuth, getStoreById);

router.get('/:id/ratings', 
  authenticate, 
  authorize('admin', 'store_owner'), 
  getStoreRatings
);

router.post('/', [
  authenticate,
  authorize('admin'),
  sanitizeInput,
  validateStoreName,
  validateStoreEmail,
  validateAddress,
  body('owner_id').optional().isInt().withMessage('Owner ID must be an integer'),
  handleValidationErrors
], createStore);

router.put('/:id', [
  authenticate,
  sanitizeInput,
  validateStoreName.optional(),
  validateStoreEmail.optional(),
  validateAddress.optional(),
  body('owner_id').optional().isInt().withMessage('Owner ID must be an integer'),
  handleValidationErrors
], updateStore);

router.delete('/:id', 
  authenticate, 
  authorize('admin'), 
  deleteStore
);

module.exports = router;
