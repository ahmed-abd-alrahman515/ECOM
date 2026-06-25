import type { Metadata } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { cookies } from 'next/headers'
import './globals.css'
import { I18nProvider } from '@/components/i18n-provider'
import { StoreProvider } from '@/components/store-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { GlobalFooter } from '@/components/global-footer'
import { Toaster } from '@/components/ui/sonner'
import { defaultLocale, isRTL, t } from '@/lib/i18n'
import { getServerDictionary } from '@/lib/i18n-server'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-editorial' });

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getServerDictionary()
  return {
    title: t(dict, 'meta.title'),
    description: t(dict, 'meta.description'),
    generator: 'v0.app',
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
    },
    icons: {
      icon: [
        {
          url: '/icon-light-32x32.png',
          media: '(prefers-color-scheme: light)',
        },
        {
          url: '/icon-dark-32x32.png',
          media: '(prefers-color-scheme: dark)',
        },
        {
          url: '/icon.svg',
          type: 'image/svg+xml',
        },
      ],
      apple: '/apple-icon.png',
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const langCookie = cookieStore.get('lang')?.value
  const locale = (langCookie === 'ar' || langCookie === 'en') ? (langCookie as 'ar' | 'en') : defaultLocale
  const dir = isRTL(locale) ? 'rtl' : 'ltr'
  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${playfairDisplay.variable} page-shell min-h-screen bg-background font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="store-theme">
          <StoreProvider>
            <I18nProvider initialLocale={locale}>
              <div className="flex min-h-screen flex-col">
                <main className="relative flex-1">{children}</main>
                <GlobalFooter />
              </div>
            </I18nProvider>
            <Toaster richColors position="top-center" />
          </StoreProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
