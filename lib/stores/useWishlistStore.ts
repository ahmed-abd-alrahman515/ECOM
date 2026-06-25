'use client';

import { create } from 'zustand';
import { addToWishlist as addToWishlistRequest, getWishlist, removeFromWishlist as removeFromWishlistRequest } from '@/lib/api/wishlist';
import type { Product } from '@/lib/types/api';

interface WishlistStoreState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (product_id: string) => Promise<void>;
  removeFromWishlist: (product_id: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStoreState>()(
  (set, get) => ({
    items: [],
    isLoading: true,
    error: null,
    fetchWishlist: async () => {
      set({ isLoading: true, error: null });
      try {
        const items = await getWishlist();
        set({ items, isLoading: false, error: null });
      } catch (error) {
        set({ isLoading: false, error: error instanceof Error ? error.message : 'Unable to load wishlist.' });
        throw error;
      }
    },
    addToWishlist: async (product_id) => {
      set({ isLoading: true, error: null });
      try {
        const items = await addToWishlistRequest(product_id);
        set({ items, isLoading: false, error: null });
      } catch (error) {
        set({ isLoading: false, error: error instanceof Error ? error.message : 'Unable to update wishlist.' });
        throw error;
      }
    },
    removeFromWishlist: async (product_id) => {
      set({ isLoading: true, error: null });
      try {
        const items = await removeFromWishlistRequest(product_id);
        set({ items, isLoading: false, error: null });
      } catch (error) {
        set({ isLoading: false, error: error instanceof Error ? error.message : 'Unable to update wishlist.' });
        throw error;
      }
    },
    isInWishlist: (productId) => get().items.some((item) => item.id === productId),
    clearWishlist: () => set({ items: [], isLoading: false, error: null }),
  }),
);
