'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

const translations = {
  ar: {
    title: 'أناقة عصرية',
    cta: ' تسوق الآن',
  },
  en: {
    title: 'Modern Elegance',
    cta: 'Shop Now',
  },
  fr: {
    title: 'Élégance Moderne',
    cta: 'Acheter Maintenant',
  }
}

export default function Hero({ locale = 'en' }) {
  const t = translations[locale] || translations.en
  const isRTL = locale === 'ar'
  const Arrow = isRTL ? ArrowLeft : ArrowRight

  return (
    <section className="relative h-[75vh] flex flex-col items-center justify-end pt-14 lg:pt-20 pb-8 lg:pb-12">
      <Image
        src="/hemahero1.webp"
        alt="HEMA Collection"
        fill
        priority
        fetchPriority="high"
        unoptimized
        className="object-cover object-top"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))',
      }} />

      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">


        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-[0.9] mb-2"
          style={{ fontFamily: isRTL ? 'var(--font-amiri)' : 'var(--font-playfair)' }}
        >
          {t.title}
        </motion.h1>


        <motion.a
          href="#products"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="inline-flex items-center gap-1.5 sm:gap-3 px-4 sm:px-6 md:px-8 py-2 sm:py-3 border border-white/40 hover:border-white transition-all  bg-black/70 text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] hover:gap-3 sm:hover:gap-4 md:hover:gap-5 hover:bg-white/5 group"
        >
          {t.cta}
          <Arrow size={10} className="sm:w-3 sm:h-3 md:w-4 md:h-4 group-hover:translate-x-0.5 sm:group-hover:translate-x-1 transition-transform" />
        </motion.a>
      </div>


    </section>
  )
}