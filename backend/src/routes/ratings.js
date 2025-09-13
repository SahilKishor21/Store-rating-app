const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidationErrors, sanitizeInput } = require('../middleware/validation');
const { validateRating } = require('../utils/validation');
const {
  submitRating,
  getUserRatings,
  deleteRating,
  getAllRatings
} = require('../controllers/ratingController');

const router = express.Router();
router.post('/', [
  authenticate,
  authorize('user'),
  sanitizeInput,
  body('store_id').isInt().withMessage('Store ID must be an integer'),
  validateRating,
  handleValidationErrors
], submitRating);

router.get('/my-ratings', 
  authenticate, 
  authorize('user'), 
  getUserRatings
);

router.get('/', 
  authenticate, 
  authorize('admin'), 
  getAllRatings
);

router.delete('/:id', 
  authenticate, 
  deleteRating
);

module.exports = router;