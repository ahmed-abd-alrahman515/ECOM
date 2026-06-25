import { cookies } from 'next/headers'
import { defaultLocale, getDictionary, type Locale } from '@/lib/i18n'

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const langCookie = cookieStore.get('lang')?.value
  return (langCookie === 'ar' || langCookie === 'en') ? (langCookie as Locale) : defaultLocale
}

export async function getServerDictionary(localeArg?: Locale) {
  const locale = localeArg ?? await getServerLocale()
  return getDictionary(locale)
}
