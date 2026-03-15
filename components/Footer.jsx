'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const translations = {
  ar: {
    sizeGuide: 'دليل المقاسات',
    ourStory: 'قصتنا',
    newArrivals: 'المجموعة الجديدة',
    shirts: 'القمصان',
    trousers: 'السراويل',
    outerwear: 'السترات',
    rights: 'جميع الحقوق محفوظة',
    newsletter: 'كن أول من يعلم',
    newsletterSub: 'اشترك لتصلك آخر الإصدارات والعروض الحصرية.',
    placeholder: 'بريدك الإلكتروني',
    subscribe: 'اشتراك',
    thanks: 'شكراً! سنبقيك على اطلاع.',
  },
  en: {
    sizeGuide: 'Size Guide',
    ourStory: 'Our Story',
    newArrivals: 'New Arrivals',
    shirts: 'Shirts',
    trousers: 'Trousers',
    outerwear: 'Outerwear',
    rights: 'All Rights Reserved',
    newsletter: 'Be the first to know',
    newsletterSub: 'Subscribe for new drops and exclusive offers.',
    placeholder: 'Your email address',
    subscribe: 'Subscribe',
    thanks: 'Thanks! We\'ll keep you posted.',
  }
}

// Simple SVG icons for Instagram, TikTok, Facebook
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.37 6.37 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  )
}

export function NewsletterSection({ locale }) {
  const t = translations[locale] || translations.en
  const isRTL = locale === 'ar'
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="py-12 px-6 lg:px-12 bg-white border-t border-[#E8E0D8]" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="max-w-[500px] mx-auto text-center">
        <h3 className="text-sm uppercase tracking-[0.25em] text-black mb-1" style={{ fontFamily: 'Maharlika' }}>{t.newsletter}</h3>
        <p className="text-xs text-[#999] mb-6">{t.newsletterSub}</p>
        {submitted ? (
          <p className="text-xs text-[#A67B5B] tracking-wide">{t.thanks}</p>
        ) : (
          <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-0 max-w-sm mx-auto ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 border border-[#D1CCC6] sm:border-r-0 text-black placeholder:text-[#BBB] text-xs px-4 py-2.5 outline-none focus:border-[#A67B5B] transition-colors bg-white"
            />
            <button
              type="submit"
              className="bg-black text-white text-xs uppercase tracking-[0.2em] px-5 py-2.5 hover:bg-[#333] transition-colors whitespace-nowrap"
            >{t.subscribe}</button>
          </form>
        )}
      </div>
    </section>
  )
}

export default function Footer({ locale }) {
  const t = translations[locale] || translations.en
  const isRTL = locale === 'ar'

  return (
    <footer className="bg-[#F5F5F5] py-10 px-6 lg:px-12" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="max-w-[1440px] mx-auto">

        {/* Main row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Image src="/hemalogo.webp" alt="HEMA" width={32} height={32} className="object-contain" />
              <p className="text-xl tracking-[0.1em] text-[#1A1A1A]" style={{ fontFamily: 'Maharlika' }}>HEMA</p>
            </div>
            <a href="mailto:contact.hemawear@gmail.com" className="text-xs text-[#666] hover:text-[#A67B5B] transition-colors">contact.hemawear@gmail.com</a>
            <p className="text-xs text-[#666] mt-1">Algiers, Algeria</p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-4">
              <a href="https://www.instagram.com/wearhema" target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-[#A67B5B] transition-colors"><InstagramIcon /></a>
              <a href="https://www.tiktok.com/@hema.wear" target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-[#A67B5B] transition-colors"><TikTokIcon /></a>
              <a href="https://www.facebook.com/profile.php?id=61586453519183" target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-[#A67B5B] transition-colors"><FacebookIcon /></a>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#999] mb-3">Shop</p>
              <ul className="space-y-2 text-xs text-[#333]">
                <li><Link href={`/${locale}/new-arrivals`} className="hover:text-[#A67B5B] transition-colors">{t.newArrivals}</Link></li>
                <li><Link href={`/${locale}/shirts`} className="hover:text-[#A67B5B] transition-colors">{t.shirts}</Link></li>
                <li><Link href={`/${locale}/trousers`} className="hover:text-[#A67B5B] transition-colors">{t.trousers}</Link></li>
                <li><Link href={`/${locale}/outerwear`} className="hover:text-[#A67B5B] transition-colors">{t.outerwear}</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#999] mb-3">Info</p>
              <ul className="space-y-2 text-xs text-[#333]">
                <li><Link href={`/${locale}/about`} className="hover:text-[#A67B5B] transition-colors">{t.ourStory}</Link></li>
                <li><Link href={`/${locale}/size-guide`} className="hover:text-[#A67B5B] transition-colors">{t.sizeGuide}</Link></li>
                <li><Link href={`/${locale}/contact`} className="hover:text-[#A67B5B] transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 border-t border-[#D1CCC6] text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#999]">© 2026 HEMA. {t.rights}.</p>
        </div>

      </div>
    </footer>
  )
}