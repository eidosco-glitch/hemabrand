'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { cloudinaryOptimized } from '@/lib/imageUtils'

const ui = {
    ar: {
        title: 'سلة التسوق',
        empty: 'سلتك فارغة',
        browse: 'تصفح المنتجات',
        size: 'المقاس',
        color: 'اللون',
        total: 'المجموع',
        checkout: 'إتمام الطلب',
        remove: 'إزالة',
    },
    en: {
        title: 'Shopping Bag',
        empty: 'Your bag is empty',
        browse: 'Browse Products',
        size: 'Size',
        color: 'Color',
        total: 'Total',
        checkout: 'Checkout',
        remove: 'Remove',
    },
    fr: {
        title: 'Panier',
        empty: 'Votre panier est vide',
        browse: 'Parcourir les produits',
        size: 'Taille',
        color: 'Couleur',
        total: 'Total',
        checkout: 'Commander',
        remove: 'Supprimer',
    },
}

export default function CartOverlay({ locale }) {
    const { items, removeItem, updateQuantity, totalPrice, isOpen, setIsOpen } = useCart() || {}
    const isRTL = locale === 'ar'
    const t = ui[locale] || ui.en

    const getDisplayName = (product) =>
        locale === 'ar'
            ? (product.nameAr || product.name || product.nameEn || '')
            : locale === 'fr'
                ? (product.nameFr || product.nameEn || product.name || '')
                : (product.nameEn || product.name_en || product.name || '')

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-70 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    <motion.div
                        initial={{ x: isRTL ? '-100%' : '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: isRTL ? '-100%' : '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                        className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} z-70 h-full w-full max-w-md bg-white shadow-2xl flex flex-col`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDD5]">
                            <h2 className="text-sm uppercase tracking-[0.15em] font-medium text-[#1A1A1A]" style={{ fontFamily: isRTL ? 'var(--font-cairo)' : 'var(--font-inter)' }}>{t.title}</h2>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={18} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                                    <ShoppingBag size={40} className="text-[#D1CCC6]" strokeWidth={1} />
                                    <p className="text-sm text-[#999]">{t.empty}</p>
                                    <Link
                                        href={`/${locale}`}
                                        onClick={() => setIsOpen(false)}
                                        className="text-xs uppercase tracking-[0.15em] text-[#A67B5B] hover:underline"
                                    >
                                        {t.browse}
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.key} className="flex gap-3 pb-4 border-b border-[#F0ECE8]">
                                            <div className="relative w-20 h-24 bg-[#F5F5F5] shrink-0">
                                                {(item.product.imageUrl || item.product.images?.[0]) && (
                                                    <Image
                                                        src={cloudinaryOptimized(item.product.imageUrl || item.product.images?.[0])}
                                                        alt={getDisplayName(item.product)}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                        sizes="80px"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-medium text-[#1A1A1A] uppercase tracking-wide truncate">{getDisplayName(item.product)}</h4>
                                                <p className="text-xs text-[#999] mt-0.5">
                                                    {item.size && <span>{t.size}: {item.size}</span>}
                                                    {item.size && item.color && <span> · </span>}
                                                    {item.color && <span>{t.color}: {item.color}</span>}
                                                </p>
                                                <p className="text-xs font-medium text-[#1A1A1A] mt-1">DA {(item.product.price || 0).toLocaleString()}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center border border-[#E8DDD5]">
                                                        <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="px-2 py-1 text-[#666] hover:text-black"><Minus size={12} /></button>
                                                        <span className="px-2 text-xs font-medium">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="px-2 py-1 text-[#666] hover:text-black"><Plus size={12} /></button>
                                                    </div>
                                                    <button onClick={() => removeItem(item.key)} className="text-[10px] text-[#999] hover:text-[#A67B5B] uppercase tracking-wider">{t.remove}</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="px-6 py-4 border-t border-[#E8DDD5]">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs uppercase tracking-[0.15em] text-[#999]">{t.total}</span>
                                    <span className="text-sm font-medium text-[#1A1A1A]">DA {totalPrice.toLocaleString()}</span>
                                </div>
                                <Link
                                    href={`/${locale}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full bg-[#1A1A1A] text-white text-center py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#333] transition-colors"
                                >
                                    {t.checkout}
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
