'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cloudinaryOptimized } from '@/lib/imageUtils'

const fallbackSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const translations = {
  ar: {
    addToCart: 'أضف إلى السلة',
    selectSize: 'اختر المقاس',
    size: 'المقاس'
  },
  en: {
    addToCart: 'Add to Cart',
    selectSize: 'Select Size',
    size: 'Size'
  }
}

export default function ProductCard({ product, index, locale }) {
  const [showSizePanel, setShowSizePanel] = useState(false)
  const router = useRouter()
  const t = translations[locale] || translations.ar

  const displayName = locale === 'ar'
    ? (product.nameAr || product.name || product.name_en || '')
    : (product.name_en || product.nameEn || product.name || '')

  const productSizes = (product.sizes && product.sizes.length > 0) ? product.sizes : fallbackSizes
  const isSoldOut = product.stock === 0 || product.inStock === false

  const handleSizeSelect = (size) => {
    setShowSizePanel(false)
    router.push(`/${locale}/products/${product.id}?size=${size}&order=true`)
  }

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isSoldOut) setShowSizePanel(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <Link href={`/${locale}/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F5] mb-3">
          {(product.imageUrl || product.images?.[0] || product.image) ? (
            <Image
              src={cloudinaryOptimized(product.imageUrl || product.images?.[0] || product.image)}
              alt={displayName}
              fill
              priority={index < 4}
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
            />
          ) : (
            <div className="w-full h-full bg-[#E8E4DF]" />
          )}

          {/* Sold Out Overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-white/70 z-40 flex items-center justify-center">
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-[#1A1A1A] border border-[#1A1A1A] px-3 py-1.5">
                {locale === 'ar' ? 'نفذ المخزون' : 'Sold Out'}
              </span>
            </div>
          )}

          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            disabled={isSoldOut}
            className={`absolute bottom-3 right-3 w-6 h-6 flex items-center justify-center transition-all duration-300 ${isSoldOut ? 'opacity-0 pointer-events-none' : 'hover:scale-125'}`}
            title={t.addToCart}
          >
            <Plus size={24} className="text-[#000]" strokeWidth={1} />
          </button>

          {/* Size Panel - slides up from bottom */}
          {showSizePanel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowSizePanel(false) }}
            >
              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.18 }}
                className="bg-white p-4"
                onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#000] font-medium">{t.selectSize}</span>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowSizePanel(false) }}
                    className="text-[#888] hover:text-[#000] transition-colors"
                  >
                    <X size={13} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {productSizes.map((size) => (
                    <button
                      key={size}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSizeSelect(size) }}
                      className="flex-1 min-w-[32px] py-2.5 border border-[#1A1A1A] text-[10px] font-medium uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all duration-150"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.05em] text-[#1A1A1A] leading-tight flex-1">
            {displayName}
          </h4>
          <span className="text-[10px] md:text-[11px] text-[#1A1A1A] font-medium tracking-[0.05em] whitespace-nowrap">
            {product.price.toLocaleString()} DA
          </span>
        </div>
      </Link>
    </motion.div>
  )
}