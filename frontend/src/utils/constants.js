// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    UPDATE_PASSWORD: '/auth/password',
  },
  USERS: {
    BASE: '/users',
    DASHBOARD_STATS: '/users/dashboard-stats',
  },
  STORES: {
    BASE: '/stores',
    RATINGS: (id) => `/stores/${id}/ratings`,
  },
  RATINGS: {
    BASE: '/ratings',
    MY_RATINGS: '/ratings/my-ratings',
  },
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  STORE_OWNER: 'store_owner',
};

// Role labels
export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'System Administrator',
  [USER_ROLES.USER]: 'Normal User',
  [USER_ROLES.STORE_OWNER]: 'Store Owner',
};

// Navigation items by role
export const NAVIGATION_ITEMS = {
  [USER_ROLES.ADMIN]: [
    { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/users', label: 'Users', icon: 'Users' },
    { href: '/admin/stores', label: 'Stores', icon: 'Store' },
    { href: '/admin/ratings', label: 'Ratings', icon: 'Star' },
  ],
  [USER_ROLES.USER]: [
    { href: '/stores', label: 'Stores', icon: 'Store' },
    { href: '/my-ratings', label: 'My Ratings', icon: 'Star' },
    { href: '/profile', label: 'Profile', icon: 'User' },
  ],
  [USER_ROLES.STORE_OWNER]: [
    { href: '/store-dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/profile', label: 'Profile', icon: 'User' },
  ],
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  SIZE_OPTIONS: [5, 10, 20, 50],
};

// Form validation
export const VALIDATION = {
  NAME: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 60,
  },
  ADDRESS: {
    MAX_LENGTH: 400,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 16,
  },
  RATING: {
    MIN: 1,
    MAX: 5,
  },
};

// Sort options
export const SORT_OPTIONS = {
  USERS: [
    { value: 'name:ASC', label: 'Name (A-Z)' },
    { value: 'name:DESC', label: 'Name (Z-A)' },
    { value: 'email:ASC', label: 'Email (A-Z)' },
    { value: 'email:DESC', label: 'Email (Z-A)' },
    { value: 'created_at:DESC', label: 'Newest First' },
    { value: 'created_at:ASC', label: 'Oldest First' },
  ],
  STORES: [
    { value: 'name:ASC', label: 'Name (A-Z)' },
    { value: 'name:DESC', label: 'Name (Z-A)' },
    { value: 'average_rating:DESC', label: 'Highest Rated' },
    { value: 'average_rating:ASC', label: 'Lowest Rated' },
    { value: 'created_at:DESC', label: 'Newest First' },
    { value: 'created_at:ASC', label: 'Oldest First' },
  ],
};

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
};

// Status messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful!',
    REGISTER: 'Registration successful!',
    UPDATE: 'Updated successfully!',
    DELETE: 'Deleted successfully!',
    RATING_SUBMIT: 'Rating submitted successfully!',
    PASSWORD_UPDATE: 'Password updated successfully!',
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    VALIDATION: 'Please check your input and try again.',
  },
};

// Rating stars
export const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

export default {
  API_ENDPOINTS,
  USER_ROLES,
  ROLE_LABELS,
  NAVIGATION_ITEMS,
  PAGINATION,
  VALIDATION,
  SORT_OPTIONS,
  THEME,
  STORAGE_KEYS,
  MESSAGES,
  RATING_LABELS,
};