'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { cloudinaryOptimized } from '@/lib/imageUtils'
import { useWishlist } from '@/context/WishlistContext'
import { products as staticProducts } from '@/lib/products'

const ui = {
    ar: {
        title: 'المفضلة',
        empty: 'قائمة المفضلة فارغة',
        emptySub: 'احفظ المنتجات التي تعجبك بالنقر على أيقونة القلب',
        remove: 'إزالة',
        shop: 'تسوق الآن',
    },
    en: {
        title: 'Wishlist',
        empty: 'Your wishlist is empty',
        emptySub: 'Save items you love by tapping the heart icon on any product',
        remove: 'Remove',
        shop: 'Shop Now',
    },
}

export default function WishlistOverlay({ locale, isOpen, onClose }) {
    const [allProducts, setAllProducts] = useState(staticProducts)
    const { wishlist, toggleWishlist } = useWishlist() || {}
    const isRTL = locale === 'ar'
    const t = ui[locale] || ui.en

    const handleClose = useCallback(() => onClose(), [onClose])

    // Fetch live products once
    useEffect(() => {
        const fetch = async () => {
            try {
                const snap = await getDocs(collection(db, 'products'))
                if (!snap.empty) {
                    setAllProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
                }
            } catch (_) { }
        }
        fetch()
    }, [])

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') handleClose() }
        if (isOpen) window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [isOpen, handleClose])

    const wishlisted = allProducts.filter(p => (wishlist || []).includes(p.id))

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
                        {/* Header */}
                        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between h-16 border-b border-[#E8DDD5]">
                            <div className="flex items-center gap-2">
                                <Heart size={16} className="text-[#A67B5B]" />
                                <span
                                    className="text-sm tracking-widest uppercase text-[#1A1A1A]"
                                    style={{ fontFamily: isRTL ? 'var(--font-cairo)' : 'var(--font-inter)' }}
                                >
                                    {t.title}
                                    {wishlisted.length > 0 && (
                                        <span className="ml-2 text-[#999]">({wishlisted.length})</span>
                                    )}
                                </span>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-1.5 hover:bg-black/5 rounded-full transition-colors text-[#1A1A1A]"
                                aria-label="Close"
                            >
                                <X size={20} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Body */}
                        <div
                            className="max-w-360 mx-auto px-4 sm:px-6 lg:px-12 max-h-[70vh] overflow-y-auto py-4"
                            style={{ fontFamily: isRTL ? 'var(--font-cairo)' : 'var(--font-inter)' }}
                        >
                            {wishlisted.length === 0 ? (
                                <div className="py-16 flex flex-col items-center gap-3 text-center">
                                    <Heart size={36} className="text-[#D1CCC6]" />
                                    <p className="text-sm text-[#1A1A1A]">{t.empty}</p>
                                    <p className="text-xs text-[#999] max-w-xs leading-relaxed">{t.emptySub}</p>
                                    <Link
                                        href={`/${locale}/new-arrivals`}
                                        onClick={handleClose}
                                        className="mt-2 px-6 py-2.5 bg-[#1A1A1A] text-[#F8F3EE] text-xs tracking-widest uppercase hover:bg-[#2a2a2a] transition-colors"
                                    >
                                        {t.shop}
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col divide-y divide-[#E8DDD5]">
                                    {wishlisted.map(p => {
                                        const imgSrc = getImageSrc(p)
                                        const name = getDisplayName(p)
                                        return (
                                            <div key={p.id} className="flex items-center gap-4 py-3">
                                                {/* Thumbnail */}
                                                <Link
                                                    href={`/${locale}/products/${p.id}`}
                                                    onClick={handleClose}
                                                    className="w-16 h-20 shrink-0 bg-[#E8E4DF] overflow-hidden"
                                                >
                                                    {imgSrc && (
                                                        <Image
                                                            src={cloudinaryOptimized(imgSrc)}
                                                            alt={name}
                                                            width={64}
                                                            height={80}
                                                            unoptimized
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </Link>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <Link
                                                        href={`/${locale}/products/${p.id}`}
                                                        onClick={handleClose}
                                                        className="text-sm text-[#1A1A1A] hover:text-[#A67B5B] transition-colors line-clamp-2 leading-snug"
                                                    >
                                                        {name}
                                                    </Link>
                                                    {p.price && (
                                                        <p className="text-xs text-[#666] mt-1">DA {p.price}</p>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col items-end gap-2 shrink-0">
                                                    <Link
                                                        href={`/${locale}/products/${p.id}`}
                                                        onClick={handleClose}
                                                        className="flex items-center gap-1 text-xs bg-[#1A1A1A] text-white px-3 py-1.5 hover:bg-[#2a2a2a] transition-colors"
                                                    >
                                                        <ShoppingBag size={12} />
                                                        {locale === 'ar' ? 'اطلب' : 'Order'}
                                                    </Link>
                                                    <button
                                                        onClick={() => toggleWishlist(p.id)}
                                                        className="text-[10px] text-[#999] hover:text-red-500 transition-colors"
                                                    >
                                                        {t.remove}
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
