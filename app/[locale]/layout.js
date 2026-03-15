import './globals.css'
import { Inter, Cairo, Playfair_Display } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import NavigationWrapper from '@/components/NavigationWrapper'
import Footer, { NewsletterSection } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo', display: 'swap', preload: false })
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap', preload: false })

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }]
}

export const metadata = {
  metadataBase: new URL('https://hemaclothes.com'),
  title: 'HEMA STORE',
  description: 'Premium contemporary fashion',
  icons: {
    icon: '/favicon.webp',
  },
  openGraph: {
    title: 'HEMA STORE',
    description: 'Premium contemporary fashion',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.jpg'],
  },
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params

  const isArabic = locale === 'ar'
  const lang = isArabic ? 'ar' : 'en'
  const dir = isArabic ? 'rtl' : 'ltr'

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/hemaheroes.webp" fetchPriority="high" />
      </head>
      <body className={`${inter.variable} ${cairo.variable} ${playfairDisplay.variable} font-sans antialiased bg-paper text-text`}>
        <NextIntlClientProvider locale={locale}>
          <NavigationWrapper locale={locale} />
          {children}
          <NewsletterSection locale={locale} />
          <Footer locale={locale} />        </NextIntlClientProvider>
      </body>
    </html>
  )
}
