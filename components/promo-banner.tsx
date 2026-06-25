'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/i18n-provider';

export function PromoBanner() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 px-4 py-20 duration-700 sm:px-6 lg:px-8">
      <div className="group relative h-[28rem] overflow-hidden rounded-[2rem] border border-border/40 shadow-xl sm:h-[32rem]">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=800&fit=crop"
          alt="Summer Collection"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25 transition-colors group-hover:from-black/80 group-hover:via-black/60 group-hover:to-black/35" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 text-center sm:px-12 lg:px-16 lg:text-left">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/75">
            Limited Time Offer
          </p>
          <h2 className="mb-6 max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            {t('promo.summerCollection')}
          </h2>
          <p className="mb-10 max-w-xl text-lg text-white/85 sm:text-xl lg:mx-0">
            {t('hero.subtitle')}
          </p>
          <div>
            <Button asChild size="lg" className="px-10 py-6 text-lg shadow-2xl">
              <Link href="/products">
                {t('promo.shopNow')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
