const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

const sanitizeInput = (req, res, next) => {
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  };

  // Sanitize body
  if (req.body) {
    for (const key in req.body) {
      req.body[key] = sanitizeValue(req.body[key]);
    }
  }

  if (req.query) {
    for (const key in req.query) {
      req.query[key] = sanitizeValue(req.query[key]);
    }
  }

  next();
};

module.exports = {
  handleValidationErrors,
  sanitizeInput
};