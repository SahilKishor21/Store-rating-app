import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../utils/api';
import { STORAGE_KEYS } from '../utils/constants';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login(credentials);
          const { user, token } = response.data.data;
          
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            message: error.response?.data?.message || 'Login failed',
          };
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.register(userData);
          const { user, token } = response.data.data;
          
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            message: error.response?.data?.message || 'Registration failed',
          };
        }
      },

      logout: () => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updatePassword: async (passwordData) => {
        set({ isLoading: true });
        try {
          await authAPI.updatePassword(passwordData);
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            message: error.response?.data?.message || 'Password update failed',
          };
        }
      },

      updateProfile: (updatedUser) => {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        set({ user: updatedUser });
      },

      initializeAuth: () => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const user = localStorage.getItem(STORAGE_KEYS.USER);
        
        if (token && user) {
          try {
            const parsedUser = JSON.parse(user);
            set({
              user: parsedUser,
              token,
              isAuthenticated: true,
            });
          } catch (error) {
            console.error('Error parsing user from storage:', error);
            get().logout();
          }
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
