const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpire, bcryptRounds } = require('../config/auth');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, bcryptRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpire });
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

const formatUserResponse = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  
  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, items, totalPages, currentPage };
};

const sanitizeSortParams = (sort, allowedFields) => {
  if (!sort) return { field: 'created_at', order: 'DESC' };
  
  const [field, order] = sort.split(':');
  
  return {
    field: allowedFields.includes(field) ? field : 'created_at',
    order: order && order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'
  };
};

const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  formatUserResponse,
  getPagination,
  getPagingData,
  sanitizeSortParams,
  generateRandomString
};