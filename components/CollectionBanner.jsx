'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

const slides = [
    { image: '/newcollection.webp' },
    { image: '/newcollection1.webp' },
]

export default function CollectionBanner({ locale }) {
    const isRTL = locale === 'ar'
    const Arrow = isRTL ? ArrowLeft : ArrowRight
    const [current, setCurrent] = useState(0)
    const [direction, setDirection] = useState(1)

    const go = useCallback((idx) => {
        setDirection(idx > current ? 1 : -1)
        setCurrent(idx)
    }, [current])

    const next = useCallback(() => {
        const idx = (current + 1) % slides.length
        setDirection(1)
        setCurrent(idx)
    }, [current])

    useEffect(() => {
        const timer = setInterval(next, 3000)
        return () => clearInterval(timer)
    }, [next])

    const variants = {
        enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
    }

    return (
        <section className="relative h-[55vh] md:h-[70vh] overflow-hidden">
            {/* Slides */}
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={current}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.7, ease: [0.32, 0, 0.67, 0] }}
                    className="absolute inset-0 overflow-hidden"
                >
                    <Image
                        src={slides[current].image}
                        alt=""
                        fill
                        priority={current === 0}
                        unoptimized
                        className="object-cover object-center"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-end text-center text-white px-6 pb-14">
                <p className="text-[10px] uppercase tracking-[0.35em] mb-3 text-white/70">
                    HEMA — 2026
                </p>
                <h2 className="text-lg sm:text-2xl md:text-3xl font-light leading-tight mb-5 tracking-normal">
                    {locale === 'ar' ? 'إصدار محدود' : 'Limited Drop'}
                </h2>
                <a
                    href={`/${locale}/new-arrivals`}
                    className="inline-flex items-center gap-2 px-7 py-3 bg-black/80 hover:bg-black border border-white/20 text-[10px] uppercase tracking-[0.15em] transition-all group"
                >
                    {locale === 'ar' ? 'اطلب الآن' : 'Order Now'}
                    <Arrow size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => go(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
                    />
                ))}
            </div>
        </section>
    )
}
