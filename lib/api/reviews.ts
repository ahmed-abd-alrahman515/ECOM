import { createMockReview, getMockProductReviews } from '@/lib/api/mock';
import type { Review, ReviewPayload } from '@/lib/types/api';

export async function getProductReviews(productId: string): Promise<Review[]> {
  return getMockProductReviews(productId);
}

export async function createReview(productId: string, payload: ReviewPayload): Promise<Review> {
  return createMockReview(productId, payload);
}
