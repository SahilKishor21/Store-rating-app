import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
// Temporarily change the login endpoint
export const authAPI = {
  login: (credentials) => api.post('/auth/test-login', credentials), // Changed from /auth/login
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updatePassword: (passwordData) => api.put('/auth/password', passwordData),
};

// Users API calls
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getDashboardStats: () => api.get('/users/dashboard-stats'),
};

// Stores API calls
export const storesAPI = {
  getAll: (params) => api.get('/stores', { params }),
  getById: (id) => api.get(`/stores/${id}`),
  create: (storeData) => api.post('/stores', storeData),
  update: (id, storeData) => api.put(`/stores/${id}`, storeData),
  delete: (id) => api.delete(`/stores/${id}`),
  getRatings: (id) => api.get(`/stores/${id}/ratings`),
};

// Ratings API calls
export const ratingsAPI = {
  submit: (ratingData) => api.post('/ratings', ratingData),
  getUserRatings: (params) => api.get('/ratings/my-ratings', { params }),
  getAll: (params) => api.get('/ratings', { params }),
  delete: (id) => api.delete(`/ratings/${id}`),
};

// Temporarily change the login endpoint


export default api;