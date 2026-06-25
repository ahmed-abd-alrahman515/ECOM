'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { Header } from '@/components/header';
import { EmptyState } from '@/components/empty-state';
import { ProductSkeleton } from '@/components/loading/product-skeleton';
import { ProductCard } from '@/components/product-card';
import { useWishlistStore } from '@/lib/store';
import { useI18n } from '@/components/i18n-provider';

export default function WishlistPage() {
  const products = useWishlistStore((state) => state.items);
  const isLoading = useWishlistStore((state) => state.isLoading);
  const error = useWishlistStore((state) => state.error);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const { t } = useI18n();

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        await fetchWishlist();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load wishlist');
      }
    };

    void loadWishlist();
  }, [fetchWishlist]);

  return (
    <div className="min-h-full bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <h1 className="text-3xl font-bold text-foreground mb-8">{t('wishlist.title')}</h1>

        {isLoading ? (
          <ProductSkeleton count={4} />
        ) : error ? (
          <EmptyState
            title={error}
            actionLabel={t('wishlist.startShopping')}
            actionHref="/products"
          />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={t('wishlist.empty')}
            actionLabel={t('wishlist.startShopping')}
            actionHref="/products"
          />
        )}
      </div>
    </div>
  );
}
