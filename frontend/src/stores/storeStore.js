import { create } from 'zustand';
import { storesAPI, ratingsAPI } from '../utils/api';

const useStoreStore = create((set, get) => ({
  stores: [],
  currentStore: null,
  userRatings: {},
  storeRatings: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
  },

  // Fetch all stores
  fetchStores: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await storesAPI.getAll(params);
      const { stores, pagination } = response.data.data;
      
      // Extract user ratings for quick access
      const userRatings = {};
      stores.forEach(store => {
        if (store.user_rating) {
          userRatings[store.id] = store.user_rating;
        }
      });
      
      set({
        stores,
        userRatings,
        pagination,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch stores',
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch stores',
      };
    }
  },

  // Fetch store by ID
  fetchStoreById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await storesAPI.getById(id);
      const store = response.data.data.store;
      
      set({
        currentStore: store,
        isLoading: false,
      });
      
      return { success: true, store };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch store',
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch store',
      };
    }
  },

  // Create store
  createStore: async (storeData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await storesAPI.create(storeData);
      const newStore = response.data.data.store;
      
      set((state) => ({
        stores: [newStore, ...state.stores],
        isLoading: false,
      }));
      
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create store',
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create store',
      };
    }
  },

  // Update store
  updateStore: async (id, storeData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await storesAPI.update(id, storeData);
      const updatedStore = response.data.data.store;
      
      set((state) => ({
        stores: state.stores.map(store => 
          store.id === id ? updatedStore : store
        ),
        currentStore: state.currentStore?.id === id ? updatedStore : state.currentStore,
        isLoading: false,
      }));
      
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update store',
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update store',
      };
    }
  },

  // Delete store
  deleteStore: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await storesAPI.delete(id);
      
      set((state) => ({
        stores: state.stores.filter(store => store.id !== id),
        currentStore: state.currentStore?.id === id ? null : state.currentStore,
        isLoading: false,
      }));
      
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete store',
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete store',
      };
    }
  },

  // Submit rating
  submitRating: async (storeId, rating) => {
    try {
      const response = await ratingsAPI.submit({ store_id: storeId, rating });
      
      // Update user ratings and store's average rating
      set((state) => ({
        userRatings: {
          ...state.userRatings,
          [storeId]: rating,
        },
        stores: state.stores.map(store => {
          if (store.id === storeId) {
            return {
              ...store,
              user_rating: rating,
            };
          }
          return store;
        }),
      }));
      
      // Refresh the store data to get updated average rating
      await get().fetchStoreById(storeId);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit rating',
      };
    }
  },

  // Fetch store ratings (for store owners)
  fetchStoreRatings: async (storeId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await storesAPI.getRatings(storeId);
      const { store, ratings } = response.data.data;
      
      set({
        currentStore: store,
        storeRatings: ratings,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch store ratings',
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch store ratings',
      };
    }
  },

  // Clear current store
  clearCurrentStore: () => {
    set({ currentStore: null, storeRatings: [] });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useStoreStore;