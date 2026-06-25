'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/i18n-provider';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const cartCount = useCartStore((state) => state.getItemCount());
  const { t, setLocale, locale } = useI18n();
  const isDark = theme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel mt-4 flex h-18 items-center justify-between rounded-full border border-border/60 px-4 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.45)] sm:px-6">
          <Link href="/" className="flex items-center gap-3 text-foreground">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg">
              S
            </span>
            <div className="leading-none">
              <span className="font-display block text-2xl font-semibold">{t('site.name')}</span>
              <span className="hidden text-[11px] uppercase tracking-[0.34em] text-muted-foreground sm:block">
                Curated Essentials
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-sm font-medium text-foreground/70 transition hover:text-foreground"
            >
              {t('nav.products')}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition"
            >
              {t('nav.about')}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition"
            >
              {t('nav.contact')}
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button asChild variant="ghost" size="icon" className="relative rounded-full border border-transparent hover:border-border/70">
              <Link href="/wishlist" className="relative">
                <Heart size={20} />
              </Link>
            </Button>

            <Button asChild variant="ghost" size="icon" className="relative rounded-full border border-transparent hover:border-border/70">
              <Link href="/cart" className="relative">
                <ShoppingCart size={20} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow rtl:left-0 rtl:right-auto">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="rounded-full border border-transparent hover:border-border/70" onClick={toggleTheme} aria-label={isDark ? 'Toggle light mode' : 'Toggle dark mode'}>
              {mounted && isDark ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            <Button
              variant="ghost"
              size="icon-lg"
              className="rounded-full border border-transparent px-3 hover:border-border/70"
              onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              aria-label="Toggle language"
            >
              <span className="text-xs font-bold tracking-[0.18em]">{locale === 'en' ? 'AR' : 'EN'}</span>
              <Globe size={20} />
            </Button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full border border-transparent p-2 transition hover:border-border/70 md:hidden"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="glass-panel mt-3 space-y-2 rounded-[1.75rem] border border-border/60 p-3 md:hidden">
            <Link
              href="/products"
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground/70 transition hover:bg-secondary hover:text-foreground"
            >
              {t('nav.products')}
            </Link>
            <Link
              href="/about"
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground/70 transition hover:bg-secondary hover:text-foreground"
            >
              {t('nav.about')}
            </Link>
            <Link
              href="/contact"
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground/70 transition hover:bg-secondary hover:text-foreground"
            >
              {t('nav.contact')}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
