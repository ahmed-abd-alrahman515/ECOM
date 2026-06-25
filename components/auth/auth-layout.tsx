'use client';

import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/components/i18n-provider';

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc?: string;
  title?: string;
  subtitle?: string;
}

export function AuthLayout({ 
  children, 
  imageSrc = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1200&fit=crop',
  title,
  subtitle
}: AuthLayoutProps) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Side: Illustration/Marketing */}
      <div className="hidden md:flex md:w-1/2 relative bg-secondary overflow-hidden">
        <Image
          src={imageSrc}
          alt="Auth Illustration"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-12 text-white">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-lg">
            {title || t('auth.login.subtitle')}
          </h1>
          <p className="text-xl text-white/90 max-w-md drop-shadow-md">
            {subtitle || t('hero.subtitle')}
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24 animate-in fade-in slide-in-from-right-4 duration-700">
        <div className="w-full max-w-md space-y-8">
          <div className="md:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('site.name')}
            </h1>
          </div>
          <div className="bg-card text-card-foreground p-8 rounded-3xl shadow-2xl border border-border/50 backdrop-blur-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
