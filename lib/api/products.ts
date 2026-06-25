import { getMockCategories, getMockProductBySlug, getMockProducts } from '@/lib/api/mock';
import type { Category, Product, ProductFilters } from '@/lib/types/api';

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  return getMockProducts(filters);
}

export async function getProductBySlug(slug: string): Promise<Product> {
  return getMockProductBySlug(slug);
}

export async function getCategories(): Promise<Category[]> {
  return getMockCategories();
}
