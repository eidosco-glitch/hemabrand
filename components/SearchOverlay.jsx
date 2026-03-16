'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { cloudinaryOptimized } from '@/lib/imageUtils'
import { products as staticProducts } from '@/lib/products'

const ui = {
    ar: {
        placeholder: 'ابحث عن منتج...',
        noResults: 'لا توجد نتائج',
        results: 'نتائج',
    },
    en: {
        placeholder: 'Search for a product...',
        noResults: 'No results found',
        results: 'Results',
    },
}

export default function SearchOverlay({ locale, isOpen, onClose }) {
    const [query, setQuery] = useState('')
    const [allProducts, setAllProducts] = useState(staticProducts)
    const inputRef = useRef(null)
    const isRTL = locale === 'ar'
    const t = ui[locale] || ui.en

    // Derived search results — no setState in effect
    const results = useMemo(() => {
        if (!query.trim()) return []
        const q = query.toLowerCase()
        return allProducts.filter(p => {
            const nameAr = (p.nameAr || p.name || '').toLowerCase()
            const nameEn = (p.nameEn || p.name_en || '').toLowerCase()
            const desc = (p.description || p.description_en || '').toLowerCase()
            const category = (p.category || '').toLowerCase()
            return nameAr.includes(q) || nameEn.includes(q) || desc.includes(q) || category.includes(q)
        }).slice(0, 8)
    }, [query, allProducts])

    // Reset query and close
    const handleClose = useCallback(() => {
        setQuery('')
        onClose()
    }, [onClose])

    // Load products once on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'products'))
                if (!snapshot.empty) {
                    const firestoreProducts = snapshot.docs.map(docSnap => ({
                        id: docSnap.id,
                        ...docSnap.data(),
                    }))
                    setAllProducts(firestoreProducts)
                }
            } catch (_) { /* fall back to static */ }
        }
        fetchProducts()
    }, [])

    // Focus input when overlay opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen])

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') handleClose() }
        if (isOpen) window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [isOpen, handleClose])

    const getDisplayName = (p) =>
        locale === 'ar'
            ? (p.nameAr || p.name || p.nameEn || p.name_en || '')
            : (p.nameEn || p.name_en || p.nameAr || p.name || '')

    const getImageSrc = (p) => p.imageUrl || p.images?.[0] || p.image || null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-70 bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-0 left-0 right-0 z-80 bg-[#F8F3EE] shadow-2xl"
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        {/* Search Input Row */}
                        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-12 flex items-center gap-3 h-16 border-b border-[#E8DDD5]">
                            <Search size={20} strokeWidth={1.5} className="text-[#A67B5B] shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder={t.placeholder}
                                className="flex-1 bg-transparent text-[#1A1A1A] text-base outline-none placeholder:text-[#999]"
                                style={{ fontFamily: isRTL ? 'var(--font-cairo)' : 'var(--font-inter)' }}
                            />
                            <button
                                onClick={handleClose}
                                className="p-1.5 hover:bg-black/5 rounded-full transition-colors text-[#1A1A1A]"
                            >
                                <X size={20} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Results */}
                        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-12 max-h-[70vh] overflow-y-auto">
                            {query.trim() && results.length === 0 && (
                                <div className="py-12 text-center text-[#999] text-sm" style={{ fontFamily: isRTL ? 'var(--font-cairo)' : 'var(--font-inter)' }}>
                                    {t.noResults}
                                </div>
                            )}

                            {results.length > 0 && (
                                <div className="py-4">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#999] mb-3" style={{ fontFamily: 'var(--font-inter)' }}>
                                        {results.length} {t.results}
                                    </p>
                                    <div className="flex flex-col divide-y divide-[#E8DDD5]">
                                        {results.map(p => {
                                            const imgSrc = getImageSrc(p)
                                            const name = getDisplayName(p)
                                            return (
                                                <Link
                                                    key={p.id}
                                                    href={`/${locale}/products/${p.id}`}
                                                    onClick={handleClose}
                                                    className="flex items-center gap-4 py-3 hover:bg-[#F0EBE5] transition-colors rounded-lg px-2 -mx-2"
                                                >
                                                    {/* Thumbnail */}
                                                    <div className="w-14 h-14 shrink-0 bg-[#E8E4DF] rounded-md overflow-hidden">
                                                        {imgSrc && (
                                                            <Image
                                                                src={cloudinaryOptimized(imgSrc)}
                                                                alt={name}
                                                                width={56}
                                                                height={56}
                                                                unoptimized
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-[#1A1A1A] truncate" style={{ fontFamily: isRTL ? 'var(--font-cairo)' : 'var(--font-inter)' }}>
                                                            {name}
                                                        </p>
                                                        <p className="text-xs text-[#A67B5B] mt-0.5">DA {p.price}</p>
                                                    </div>
                                                    {/* Category */}
                                                    {p.category && (
                                                        <span className="text-[10px] uppercase tracking-widest text-[#999] shrink-0 hidden sm:block">
                                                            {p.category}
                                                        </span>
                                                    )}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Empty state before typing */}
                            {!query.trim() && (
                                <div className="py-10 text-center">
                                    <p className="text-[#CCC] text-sm" style={{ fontFamily: isRTL ? 'var(--font-cairo)' : 'var(--font-inter)' }}>
                                        {t.placeholder}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
