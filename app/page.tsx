'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { EmptyState } from '@/components/empty-state';
import { ProductSkeleton } from '@/components/loading/product-skeleton';
import { useI18n } from '@/components/i18n-provider';
import { HeroSlider } from '@/components/hero-slider';
import { FeaturedProducts } from '@/components/featured-products';
import { PromoBanner } from '@/components/promo-banner';
import { BestSellers } from '@/components/best-sellers';
import { TestimonialsSlider } from '@/components/testimonials-slider';
import { getCategories, getProducts } from '@/lib/api/products';
import type { Category, Product } from '@/lib/types/api';

export default function Home() {
  const { t, locale } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingHomeData, setIsLoadingHomeData] = useState(true);
  const isRtl = locale === 'ar';

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setIsLoadingHomeData(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load homepage data');
      } finally {
        setIsLoadingHomeData(false);
      }
    };

    void loadHomeData();
  }, []);

  return (
    <div className="min-h-full bg-background">
      <Header />

      <section className="relative mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.05),transparent_30%)]" />

        <div className={`flex flex-col items-center gap-12 lg:gap-16 ${isRtl ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
          <div className="w-full max-w-xl lg:max-w-[32rem]">
            <HeroSlider />
          </div>

          <div className={`w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-6 duration-700 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div>
              <span className="mb-4 inline-flex rounded-full border border-border/70 bg-background/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground shadow-sm backdrop-blur">
                New Season Essentials
              </span>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {t('hero.title')}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-foreground/70">
                {t('hero.subtitle')}
              </p>
            </div>

            <div className={`flex flex-col gap-4 sm:flex-row ${isRtl ? 'sm:flex-row-reverse sm:justify-end' : ''}`}>
              <Button asChild size="lg" className="px-8 py-6 text-base font-semibold shadow-lg">
                <Link href="/products">
                  {t('cta.shopNow')}
                </Link>
              </Button>

              <Button asChild size="lg" variant="secondary" className="px-8 py-6 text-base">
                <Link href="/about">
                  {t('cta.learnMore')}
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/75 px-4 py-3 text-sm text-foreground/70 shadow-sm backdrop-blur">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[11px] font-bold uppercase tracking-wide text-primary-foreground">OK</span>
                {t('benefit.freeShipping')}
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/75 px-4 py-3 text-sm text-foreground/70 shadow-sm backdrop-blur">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[11px] font-bold uppercase tracking-wide text-primary-foreground">OK</span>
                {t('benefit.moneyBack')}
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/75 px-4 py-3 text-sm text-foreground/70 shadow-sm backdrop-blur">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[11px] font-bold uppercase tracking-wide text-primary-foreground">OK</span>
                {t('benefit.support')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isLoadingHomeData ? (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <ProductSkeleton count={4} />
        </section>
      ) : products.length > 0 ? (
        <>
          <FeaturedProducts products={products.filter((p) => p.rating >= 4.5).slice(0, 4)} />

          <section className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 px-4 py-20 duration-700 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Browse By Category
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t('categories.title')}
              </h2>
            </div>

            {categories.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((category) => (
                  <Link key={category.id} href={`/products?category=${category.slug || category.name}`}>
                    <div className="group relative h-56 cursor-pointer overflow-hidden rounded-[1.75rem] border border-border/60 bg-card shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-secondary" />
                      )}
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 transition-colors group-hover:via-black/45">
                        <span className="text-2xl font-bold tracking-wide text-white transition-transform duration-300 group-hover:scale-105">
                          {category.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                title={t('products.none.title')}
                description={t('products.none.subtitle')}
                actionLabel={t('cta.browseAll')}
                actionHref="/products"
              />
            )}
          </section>

          <PromoBanner />
          <BestSellers products={products.slice(0, 4)} />
        </>
      ) : (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            title={t('products.none.title')}
            description={t('products.none.subtitle')}
            actionLabel={t('cta.browseAll')}
            actionHref="/products"
          />
        </section>
      )}

      <TestimonialsSlider />

      <section className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 px-4 py-20 duration-700 sm:px-6 lg:px-8">
        <div className="group relative overflow-hidden rounded-[2rem] bg-foreground px-6 py-12 text-center shadow-2xl sm:px-12 sm:py-16">
          <div className="absolute inset-0 bg-accent/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <h2 className="relative z-10 mb-4 text-3xl font-bold text-background sm:text-4xl">
            {t('cta.ready')}
          </h2>
          <p className="relative z-10 mb-8 text-lg text-background/80">
            {t('cta.explore')}
          </p>
          <Button asChild variant="secondary" size="lg" className="relative z-10 rounded-full px-8 py-6 text-lg">
            <Link href="/products">
              {t('cta.browseAll')}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
