import { create } from 'zustand';
import { usersAPI } from '../utils/api';

const useUserStore = create((set, get) => ({
  users: [],
  currentUser: null,
  dashboardStats: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
  },

  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await usersAPI.getAll(params);
      const { users, pagination } = response.data.data;
      set({
        users,
        pagination,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch users',
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users',
      };
    }
  },

  fetchUserById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await usersAPI.getById(id);
      const user = response.data.data.user;
      set({
        currentUser: user,
        isLoading: false,
      });
      return { success: true, user };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch user',
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user',
      };
    }
  },

  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await usersAPI.create(userData);
      const newUser = response.data.data.user;
      set((state) => ({
        users: [newUser, ...state.users],
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create user',
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create user',
      };
    }
  },

  updateUser: async (id, userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await usersAPI.update(id, userData);
      const updatedUser = response.data.data.user;
      set((state) => ({
        users: state.users.map(user => 
          user.id === id ? updatedUser : user
        ),
        currentUser: state.currentUser?.id === id ? updatedUser : state.currentUser,
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update user',
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user',
      };
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await usersAPI.delete(id);
      set((state) => ({
        users: state.users.filter(user => user.id !== id),
        currentUser: state.currentUser?.id === id ? null : state.currentUser,
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete user',
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user',
      };
    }
  },

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await usersAPI.getDashboardStats();
      const stats = response.data.data;
      set({
        dashboardStats: stats,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch dashboard stats',
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard stats',
      };
    }
  },

  clearCurrentUser: () => {
    set({ currentUser: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useUserStore;
