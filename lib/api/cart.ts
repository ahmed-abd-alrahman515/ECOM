import { addMockToCart, getMockCart, removeMockFromCart } from '@/lib/api/mock';
import type { Cart, CartMutationPayload } from '@/lib/types/api';

export async function getCart(): Promise<Cart> {
  return getMockCart();
}

export async function addToCart(payload: CartMutationPayload): Promise<Cart> {
  return addMockToCart(payload);
}

export async function removeFromCart(payload: CartMutationPayload): Promise<Cart> {
  return removeMockFromCart(payload);
}
