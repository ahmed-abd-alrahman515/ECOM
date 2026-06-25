'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

export function GlobalFooter() {
  const { t, locale } = useI18n();
  const homeLabel = locale === 'ar' ? 'الرئيسية' : 'Home';

  return (
    <footer className="px-4 pb-6 pt-12 sm:px-6 lg:px-8">
      <div className="glass-panel mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] border border-border/60">
        <div className="grid gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 text-foreground">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg">
                S
              </span>
              <span className="font-display text-3xl font-semibold tracking-tight">
                {t('site.name')}
              </span>
            </Link>
            <p className="max-w-md text-sm leading-7 text-muted-foreground">
              {t('hero.subtitle')}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Navigation
            </h3>
            <nav className="grid gap-3 text-sm">
              <Link href="/" className="transition-colors hover:text-foreground">{homeLabel}</Link>
              <Link href="/products" className="transition-colors hover:text-foreground">{t('nav.products')}</Link>
              <Link href="/about" className="transition-colors hover:text-foreground">{t('nav.about')}</Link>
              <Link href="/contact" className="transition-colors hover:text-foreground">{t('nav.contact')}</Link>
            </nav>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Social
            </h3>
            <div className="flex items-center gap-3">
              <Link href="/" aria-label="Instagram" className="rounded-full border border-border p-2 text-muted-foreground transition-all hover:border-foreground hover:text-foreground">
                <Instagram size={18} />
              </Link>
              <Link href="/" aria-label="Twitter" className="rounded-full border border-border p-2 text-muted-foreground transition-all hover:border-foreground hover:text-foreground">
                <Twitter size={18} />
              </Link>
              <Link href="/" aria-label="Facebook" className="rounded-full border border-border p-2 text-muted-foreground transition-all hover:border-foreground hover:text-foreground">
                <Facebook size={18} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border/70 px-6 py-5 sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; 2026 {t('site.name')}. {t('footer.copy')}</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="transition-colors hover:text-foreground">{t('footer.privacy')}</Link>
              <Link href="/" className="transition-colors hover:text-foreground">{t('footer.terms')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
