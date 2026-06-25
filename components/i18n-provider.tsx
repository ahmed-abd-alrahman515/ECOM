 'use client'
 
 import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
 import type { Dictionary, Locale } from '@/lib/i18n'
 import { defaultLocale, getDictionary, isRTL } from '@/lib/i18n'
 
 type I18nContextValue = {
   locale: Locale
   dict: Dictionary
   t: (key: string) => string
   setLocale: (next: Locale) => void
 }
 
 const I18nContext = createContext<I18nContextValue | null>(null)
 
 type Props = {
   children: React.ReactNode
   initialLocale?: Locale
 }
 
 export function I18nProvider({ children, initialLocale = defaultLocale }: Props) {
   const [locale, setLocaleState] = useState<Locale>(initialLocale)
   const dict = useMemo(() => getDictionary(locale), [locale])
 
   useEffect(() => {
     try {
       // persist in cookie
       document.cookie = `lang=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`
       document.documentElement.lang = locale
       document.documentElement.dir = isRTL(locale) ? 'rtl' : 'ltr'
     } catch {
       // no-op
     }
   }, [locale])
 
   const value = useMemo<I18nContextValue>(() => {
     const t = (key: string) => dict[key] ?? key
     const setLocale = (next: Locale) => setLocaleState(next)
     return { locale, dict, t, setLocale }
   }, [locale, dict])
 
   return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
 }
 
 export function useI18n() {
   const ctx = useContext(I18nContext)
   if (!ctx) {
     throw new Error('useI18n must be used within I18nProvider')
   }
   return ctx
 }
