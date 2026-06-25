'use client';

import { ProductCard } from '@/components/product-card';
import { useI18n } from '@/components/i18n-provider';
import type { Product } from '@/lib/types/api';

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 px-4 py-20 duration-700 sm:px-6 lg:px-8">
      <div className="section-heading mb-10 flex items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Curated Picks
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t('featuredProducts.title')}
          </h2>
        </div>
        <div className="hidden h-px flex-1 bg-gradient-to-r from-border via-accent/50 to-transparent sm:block" />
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="h-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
