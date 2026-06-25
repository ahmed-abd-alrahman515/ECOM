'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const sliderImages = [
  {
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=1400&fit=crop',
    alt: 'Premium Headphones',
  },
  {
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=1400&fit=crop',
    alt: 'Minimalist Watch',
  },
  {
    src: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=1400&fit=crop',
    alt: 'Leather Bag',
  },
];

export function HeroSlider() {
  const [failedSlides, setFailedSlides] = useState<Record<number, boolean>>({});
  const hasWorkingSlide = useMemo(
    () => sliderImages.some((_, index) => !failedSlides[index]),
    [failedSlides],
  );

  if (!hasWorkingSlide) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.4rem] bg-[radial-gradient(circle_at_top,rgba(255,240,214,0.6),transparent_32%),linear-gradient(135deg,#3e2a22,#7a5a41)] p-8 text-white shadow-[0_35px_80px_-35px_rgba(62,42,34,0.75)] sm:aspect-[5/6] lg:h-[34rem]">
        <div className="flex h-full flex-col justify-end rounded-[1.8rem] border border-white/10 bg-white/6 p-8 backdrop-blur-sm">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-white/70">
            Premium Collection
          </p>
          <h3 className="font-display max-w-sm text-3xl font-semibold leading-tight sm:text-4xl">
            Designed for modern everyday essentials.
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.4rem] border border-white/15 bg-secondary/40 shadow-[0_35px_80px_-35px_rgba(90,67,47,0.42)] sm:aspect-[5/6] lg:h-[34rem]">
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_28%),linear-gradient(180deg,transparent_20%,rgba(20,14,10,0.12)_100%)]" />
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-full w-full"
      >
        {sliderImages.map((image, index) => (
          <SwiperSlide key={image.alt}>
            <div className="relative h-full w-full">
              {!failedSlides[index] ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                  onError={() => setFailedSlides((prev) => ({ ...prev, [index]: true }))}
                />
              ) : (
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#111827,#4b5563)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 rounded-[1.6rem] border border-white/15 bg-black/18 p-5 text-white backdrop-blur-md">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-white/70">
                  Limited Drop
                </p>
                <p className="font-display text-2xl font-semibold leading-tight">
                  Elevated pieces for a calmer, sharper storefront feel.
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.7);
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #f4c987;
          width: 24px;
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}
