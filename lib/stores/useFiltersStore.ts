'use client';

import { create } from 'zustand';
import type { ProductFilters } from '@/lib/types/api';

interface FiltersStoreState {
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  resetFilters: () => void;
}

const initialFilters: ProductFilters = {
  priceRange: [0, 1000],
  category: [],
  inStock: false,
};

export const useFiltersStore = create<FiltersStoreState>()(
  (set) => ({
    filters: initialFilters,
    setFilters: (filters) => set({ filters }),
    resetFilters: () => set({ filters: initialFilters }),
  }),
);
