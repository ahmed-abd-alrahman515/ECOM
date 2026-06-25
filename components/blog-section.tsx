'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/i18n-provider';

const articles = [
  {
    title: 'Top 10 Tech Gadgets for 2024',
    excerpt: 'Stay ahead of the curve with our pick of the most innovative and essential tech gadgets for the coming year.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
    date: 'March 10, 2024',
  },
  {
    title: 'Designing Your Modern Home Office',
    excerpt: 'Creating a productive workspace that balances comfort, style, and functionality with our curated office essentials.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f816b1a22a?w=600&h=400&fit=crop',
    date: 'March 5, 2024',
  },
  {
    title: 'The Rise of Sustainable Accessories',
    excerpt: 'Why eco-friendly materials are becoming the new standard in fashion and how to make conscious style choices.',
    image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faf7c?w=600&h=400&fit=crop',
    date: 'Feb 28, 2024',
  },
];

export function BlogSection() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-bold text-foreground">
          {t('blog.title')}
        </h2>
        <div className="h-1 flex-grow mx-8 bg-secondary rounded-full hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <div key={index} className="group bg-background rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-accent/90 text-accent-foreground px-3 py-1 rounded-full text-xs font-bold shadow-md">
                {article.date}
              </div>
            </div>
            <div className="p-8 space-y-4">
              <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors leading-snug">
                {article.title}
              </h3>
              <p className="text-foreground/70 text-sm leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
              <div className="pt-4">
                <Button variant="outline" className="group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-all rounded-full px-6">
                  {t('blog.readMore')}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
