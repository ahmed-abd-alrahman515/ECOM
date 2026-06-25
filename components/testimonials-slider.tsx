'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import { useI18n } from '@/components/i18n-provider';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Verified Customer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    text: 'The quality of products exceeded my expectations. Shipping was fast and the customer support was incredibly helpful.',
  },
  {
    name: 'Michael Chen',
    role: 'Verified Customer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 5,
    text: 'I love the minimalist design of their accessories. They really understand modern aesthetics and quality.',
  },
  {
    name: 'Emma Wilson',
    role: 'Verified Customer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 4,
    text: 'Great experience overall. The sustainable water bottle is my favorite purchase this year.',
  },
];

export function TestimonialsSlider() {
  const { t } = useI18n();

  return (
    <section className="mx-auto my-16 max-w-7xl animate-in fade-in slide-in-from-bottom-2 px-4 py-16 duration-700 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.4rem] border border-border/60 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--card)_92%,white_8%),color-mix(in_oklch,var(--secondary)_85%,transparent)),radial-gradient(circle_at_top_right,color-mix(in_oklch,var(--accent)_14%,transparent),transparent_36%)] px-6 py-10 shadow-[0_26px_60px_-34px_rgba(71,50,35,0.35)] sm:px-8 lg:px-10">
        <div className="mb-12 flex flex-col gap-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Client Notes
          </p>
          <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
            {t('testimonials.title')}
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="pb-16"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="glass-panel hover-lift flex h-full flex-col justify-between rounded-[1.9rem] border border-border p-8">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < item.rating ? 'text-accent' : 'text-muted'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="font-display line-clamp-4 text-xl leading-relaxed text-foreground/82">
                    "{item.text}"
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-4 border-t border-border pt-6">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-accent/20">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="mb-1 font-bold leading-none text-foreground">
                      {item.name}
                    </h4>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background: var(--accent);
        }
      `}</style>
    </section>
  );
}
