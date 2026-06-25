'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { EmptyState } from '@/components/empty-state';
import { PageSkeleton } from '@/components/loading/page-skeleton';
import { ProductCard } from '@/components/product-card';
import { getCategories, getProducts } from '@/lib/api/products';
import { useFiltersStore } from '@/lib/store';
import { useI18n } from '@/components/i18n-provider';
import { toast } from 'sonner';
import type { Category, Product } from '@/lib/types/api';

function normalizeCategory(value: string | null) {
  return value?.trim() || '';
}

function getCategoryValue(category: Category) {
  return category.slug || category.name;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const filters = useFiltersStore((state) => state.filters);
  const setFilters = useFiltersStore((state) => state.setFilters);
  const resetFilters = useFiltersStore((state) => state.resetFilters);
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialCategory = useMemo(
    () => normalizeCategory(searchParams.get('category')),
    [searchParams],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || initialized) {
      return;
    }

    setFilters({
      ...filters,
      category: initialCategory ? [initialCategory] : [],
    });
    setInitialized(true);
  }, [mounted, initialized, initialCategory, filters, setFilters]);

  useEffect(() => {
    if (!mounted || !initialized) {
      return;
    }

    const loadData = async () => {
      setIsLoading(true);

      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(filters),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [mounted, initialized, filters]);

  useEffect(() => {
    if (!mounted || !initialized) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    const selectedCategory = normalizeCategory(filters.category?.[0] ?? '');

    if (selectedCategory) {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }

    const nextQuery = params.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
    const currentUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

    if (nextUrl !== currentUrl) {
      router.push(nextUrl, { scroll: false });
    }
  }, [mounted, initialized, filters.category, pathname, router, searchParams]);

  const handlePriceChange = (value: number[]) => {
    setFilters({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  };

  const handleCategoryChange = (category: string) => {
    const currentCategory = filters.category?.[0] ?? '';
    const nextCategory = currentCategory === category ? [] : [category];

    setFilters({
      ...filters,
      category: nextCategory,
    });
  };

  const handleInStockChange = () => {
    setFilters({
      ...filters,
      inStock: !filters.inStock,
    });
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  if (!mounted || !initialized || isLoading) {
    return (
      <div className="min-h-full bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <PageSkeleton showSidebar cards={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">{t('products.title')}</h1>
          <p className="max-w-2xl text-lg text-foreground/70">{t('products.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-8 rounded-[1.75rem] border border-border/60 bg-card/90 p-6 shadow-sm animate-in fade-in slide-in-from-left-2 duration-700">
              <div>
                <h3 className="mb-1 text-lg font-bold text-foreground">{t('filters.title')}</h3>
                <p className="text-sm text-muted-foreground">Refine by price, category, and stock.</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">{t('filters.priceRange')}</h4>
                <Slider
                  value={filters.priceRange ?? [0, 1000]}
                  onValueChange={handlePriceChange}
                  min={0}
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-foreground/70">
                  <span>${filters.priceRange?.[0] ?? 0}</span>
                  <span>${filters.priceRange?.[1] ?? 1000}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">{t('filters.category')}</h4>
                {categories.map((category) => {
                  const categoryValue = getCategoryValue(category);
                  const isChecked = (filters.category?.[0] ?? '') === categoryValue;

                  return (
                    <label
                      key={category.id}
                      className="flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent px-3 py-2 text-sm transition-colors hover:border-border hover:bg-secondary/40"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleCategoryChange(categoryValue)}
                      />
                      <span className="text-foreground/70">{category.name}</span>
                    </label>
                  );
                })}
              </div>

              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent px-3 py-2 text-sm transition-colors hover:border-border hover:bg-secondary/40">
                  <Checkbox
                    checked={filters.inStock}
                    onCheckedChange={handleInStockChange}
                  />
                  <span className="text-foreground/70">{t('filters.inStock')}</span>
                </label>
              </div>

              <Button
                variant="secondary"
                className="w-full text-sm"
                onClick={handleResetFilters}
              >
                {t('filters.reset')}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-700 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                title={t('products.none.title')}
                description={t('products.none.subtitle')}
                actionLabel={t('filters.clear')}
                onAction={handleResetFilters}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
