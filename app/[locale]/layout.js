import './globals.css'
import { Inter, Cairo, Playfair_Display, Amiri } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import NavigationWrapper from '@/components/NavigationWrapper'
import Footer, { NewsletterSection } from '@/components/Footer'
import { AuthProvider } from '@/context/AuthContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo', display: 'swap', preload: false })
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap', preload: false })
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-amiri', display: 'swap', preload: false })

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }, { locale: 'fr' }]
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
  const lang = locale
  const dir = isArabic ? 'rtl' : 'ltr'

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/hemahero.webp" fetchPriority="high" />
      </head>
      <body className={`${inter.variable} ${cairo.variable} ${playfairDisplay.variable} ${amiri.variable} font-sans antialiased bg-paper text-text`}>
        <NextIntlClientProvider locale={locale}>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <NavigationWrapper locale={locale} />
                {children}
                <NewsletterSection locale={locale} />
                <Footer locale={locale} />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
