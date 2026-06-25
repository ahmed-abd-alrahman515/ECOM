import { addMockToWishlist, getMockWishlist, removeMockFromWishlist } from '@/lib/api/mock';
import type { Product } from '@/lib/types/api';

export async function getWishlist(): Promise<Product[]> {
  return getMockWishlist();
}

export async function addToWishlist(product_id: string): Promise<Product[]> {
  return addMockToWishlist(product_id);
}

export async function removeFromWishlist(product_id: string): Promise<Product[]> {
  return removeMockFromWishlist(product_id);
}
