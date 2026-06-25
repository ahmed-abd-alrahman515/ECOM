'use client';

import { create } from 'zustand';
import { addToCart as addToCartRequest, getCart, removeFromCart as removeFromCartRequest } from '@/lib/api/cart';
import type { Cart, CartItem, CartMutationPayload } from '@/lib/types/api';

interface CartStoreState {
  items: CartItem[];
  summary: Cart;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (payload: CartMutationPayload) => Promise<void>;
  removeFromCart: (payload: CartMutationPayload) => Promise<void>;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

const emptyCart: Cart = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
};

function getCartItemIdentity(item: Pick<CartItem, 'variant_id' | 'product_id'>) {
  return item.variant_id ? `variant:${item.variant_id}` : `product:${item.product_id}`;
}

function getPayloadIdentity(payload: Pick<CartMutationPayload, 'variant_id' | 'product_id'>) {
  return payload.variant_id ? `variant:${payload.variant_id}` : `product:${payload.product_id}`;
}

function mergeCartItemsByIdentity(items: CartItem[]) {
  const merged = new Map<string, CartItem>();

  for (const item of items) {
    const key = getCartItemIdentity(item);
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, item);
      continue;
    }

    merged.set(key, {
      ...existing,
      ...item,
      id: item.variant_id ?? existing.id,
      quantity: existing.quantity + item.quantity,
      size: item.size ?? existing.size,
      color: item.color ?? existing.color,
    });
  }

  return Array.from(merged.values());
}

function syncCartState(cart: Cart) {
  const items = mergeCartItemsByIdentity(cart.items);

  return {
    items,
    summary: {
      ...cart,
      items,
    },
    isLoading: false,
    error: null,
  };
}

export const useCartStore = create<CartStoreState>()(
  (set, get) => ({
    items: [],
    summary: emptyCart,
    isLoading: true,
    error: null,
    fetchCart: async () => {
      set({ isLoading: true, error: null });
      try {
        const cart = await getCart();
        set(syncCartState(cart));
      } catch (error) {
        set({ isLoading: false, error: error instanceof Error ? error.message : 'Unable to load cart.' });
        throw error;
      }
    },
    addToCart: async (payload) => {
      set({ isLoading: true, error: null });
      try {
        const existingItem = get().items.find((item) => getCartItemIdentity(item) === getPayloadIdentity(payload));
        const requestPayload = existingItem
          ? {
              ...payload,
              quantity: payload.quantity ?? 1,
              variant_id: existingItem.variant_id ?? payload.variant_id,
              size: payload.size ?? existingItem.size,
              color: payload.color ?? existingItem.color,
            }
          : payload;
        const cart = await addToCartRequest(requestPayload);
        set(syncCartState(cart));
      } catch (error) {
        set({ isLoading: false, error: error instanceof Error ? error.message : 'Unable to update cart.' });
        throw error;
      }
    },
    removeFromCart: async (payload) => {
      set({ isLoading: true, error: null });
      try {
        const existingItem = get().items.find((item) => getCartItemIdentity(item) === getPayloadIdentity(payload));
        const requestPayload = existingItem
          ? {
              ...payload,
              variant_id: existingItem.variant_id ?? payload.variant_id,
              size: payload.size ?? existingItem.size,
              color: payload.color ?? existingItem.color,
            }
          : payload;
        const cart = await removeFromCartRequest(requestPayload);
        set(syncCartState(cart));
      } catch (error) {
        set({ isLoading: false, error: error instanceof Error ? error.message : 'Unable to update cart.' });
        throw error;
      }
    },
    clearCart: () => set({ items: [], summary: emptyCart, isLoading: false, error: null }),
    getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    getTotalPrice: () => get().summary.total || get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }),
);
