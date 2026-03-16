'use client'

import { use, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Heart, X, DollarSign } from 'lucide-react'
import { products, getProductById, getProductByIdFromFirestore, getAllProductsFromFirestore } from '@/lib/products'
import { wilayas } from '@/lib/wilayas'
import { cloudinaryOptimized } from '@/lib/imageUtils'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import { useWishlist } from '@/context/WishlistContext'

const translations = {
    ar: {
        backToProducts: 'العودة للمنتجات',
        addToCart: 'الدفع',
        checkout: 'الدفع',
        addToWishlist: 'أضف للمفضلة',
        price: 'السعر',
        originalPrice: 'السعر الأصلي',
        relatedProducts: 'منتجات ذات صلة',
        color: 'اختر اللون',
        size: 'الحجم',
        quantity: 'الكمية',
        sizeChart: 'جدول المقاسات',
        close: 'إغلاق',
        description: 'الوصف',
        washCare: 'الغسيل والعناية',
        descriptionPlaceholder: 'أضف وصفك هنا...',
        washCareText: 'غسل بماء بارد. لا تستخدم الكلور. جفف بشكل طبيعي.',
        paymentMethod: 'طريقة الدفع',
        cashDZD: 'نقداً DZD', name: 'الاسم',
        surname: 'اللقب',
        phone: 'الهاتف',
        wilaya: 'الولاية',
        commune: 'البلدية',
        address: 'العنوان / GPS',
        useGPS: 'استخدام GPS',
        order: 'اطلب الآن',
        cardNumber: 'رقم البطاقة',
        cardHolder: 'اسم صاحب البطاقة',
        cardExpiry: 'انتهاء الصلاحية',
        receivingAccount: 'معلومات الحساب',
        save: 'احفظ',
        productPrice: 'سعر المنتج',
        delivery: 'التوصيل',
        total: 'المجموع',
    },
    en: {
        backToProducts: 'Back to Products',
        addToCart: 'Check Out',
        checkout: 'Check Out',
        addToWishlist: 'Add to Wishlist',
        price: 'Price',
        originalPrice: 'Original Price',
        relatedProducts: 'Related Products',
        color: 'Choose Color',
        size: 'Size',
        quantity: 'Quantity',
        sizeChart: 'Size Chart',
        close: 'Close',
        description: 'Description',
        washCare: 'Wash & Care',
        descriptionPlaceholder: 'Add your description here...',
        washCareText: 'Wash in cold water. Do not bleach. Dry naturally.',
        paymentMethod: 'Payment Method',
        cashDZD: 'Cash DZD',
        name: 'Name',
        surname: 'Surname',
        phone: 'Phone',
        order: 'Order',
        wilaya: 'Wilaya',
        commune: 'Commune',
        address: 'Address / GPS',
        useGPS: 'Use GPS',
        cardNumber: 'Card Number',
        cardHolder: 'Cardholder Name',
        cardExpiry: 'Expiry Date',
        receivingAccount: 'Receiving Account',
        save: 'Save',
        productPrice: 'Product Price',
        delivery: 'Delivery',
        total: 'Total',
    }
}



const sizeChartData = {
    en: [
        { size: 'XS', chest: '34-36"', waist: '28-30"', length: '27"' },
        { size: 'S', chest: '36-38"', waist: '30-32"', length: '28"' },
        { size: 'M', chest: '38-40"', waist: '32-34"', length: '29"' },
        { size: 'L', chest: '40-42"', waist: '34-36"', length: '30"' },
        { size: 'XL', chest: '42-44"', waist: '36-38"', length: '31"' },
        { size: 'XXL', chest: '44-46"', waist: '38-40"', length: '32"' },
    ],
    ar: [
        { size: 'XS', chest: '34-36 بوصة', waist: '28-30 بوصة', length: '27 بوصة' },
        { size: 'S', chest: '36-38 بوصة', waist: '30-32 بوصة', length: '28 بوصة' },
        { size: 'M', chest: '38-40 بوصة', waist: '32-34 بوصة', length: '29 بوصة' },
        { size: 'L', chest: '40-42 بوصة', waist: '34-36 بوصة', length: '30 بوصة' },
        { size: 'XL', chest: '42-44 بوصة', waist: '36-38 بوصة', length: '31 بوصة' },
        { size: 'XXL', chest: '44-46 بوصة', waist: '38-40 بوصة', length: '32 بوصة' },
    ]
}

export default function ProductDetail({ params: paramsPromise }) {
    const params = use(paramsPromise)
    const searchParams = useSearchParams()
    const { id, locale } = params
    const [product, setProduct] = useState(getProductById(id) || products[0])
    const [allProducts, setAllProducts] = useState(products)
    const t = translations[locale] || translations.ar
    const { user } = useAuth() || {}
    const { toggleWishlist, isInWishlist } = useWishlist() || {}
    const [wishlistMsg, setWishlistMsg] = useState('')

    // Load live product data from Firestore
    useEffect(() => {
        getProductByIdFromFirestore(id).then(p => { if (p) setProduct(p) })
        getAllProductsFromFirestore().then(all => { if (all?.length) setAllProducts(all) })
    }, [id])

    // determine available colors/sizes from product data only (no defaults)
    const colors = product?.colors?.length ? product.colors : []
    const sizes = product?.sizes?.length ? product.sizes : []

    // Build images array from Firestore images[] or fall back to single imageUrl/image
    const productImages = product?.images?.length
        ? product.images
        : product?.imageUrl
            ? [product.imageUrl]
            : product?.image
                ? [product.image]
                : []

    // Get size and order trigger from URL parameters
    const urlSize = searchParams.get('size')
    const urlOrder = searchParams.get('order')

    const [selectedColor, setSelectedColor] = useState(null)
    const [selectedSize, setSelectedSize] = useState(urlSize || null)

    // Auto-select when there's only one option, or when product loads from Firestore
    useEffect(() => {
        if (colors.length === 1) setSelectedColor(colors[0])
        else if (colors.length > 1 && !selectedColor) setSelectedColor(null)
    }, [colors.length])

    useEffect(() => {
        const fromUrl = urlSize && sizes.includes(urlSize) ? urlSize : null
        if (fromUrl) { setSelectedSize(fromUrl); return }
        if (sizes.length === 1) setSelectedSize(sizes[0])
        else if (sizes.length > 1 && !selectedSize) setSelectedSize(null)
    }, [sizes.length])
    const [quantity, setQuantity] = useState(1)
    const [paymentMethod, setPaymentMethod] = useState('cashDZD')
    const [showOrderForm, setShowOrderForm] = useState(false)

    // Auto-open order form when arriving from quick-add size selection
    useEffect(() => {
        if (urlOrder === 'true') {
            setShowOrderForm(true)
        }
    }, [urlOrder])
    const [custName, setCustName] = useState('')
    const [custSurname, setCustSurname] = useState('')
    const [custPhone, setCustPhone] = useState('')
    const [selectedWilaya, setSelectedWilaya] = useState('')
    const [selectedCommune, setSelectedCommune] = useState('')
    const [addressDetails, setAddressDetails] = useState('')
    const [orderLoading, setOrderLoading] = useState(false)
    const [orderSuccess, setOrderSuccess] = useState(false)

    const orderTotal = product.price * quantity
    // placeholder for receiving account info that can be edited later
    const edahabiyaAccountInfo = 'IBAN: DZ00 0000 0000 0000 0000 0000';

    const handleSubmitOrder = async () => {
        if (!custName) {
            alert(locale === 'ar' ? 'يرجى إدخال الاسم' : 'Please enter your name')
            return
        }
        if (!custPhone) {
            alert(locale === 'ar' ? 'يرجى إدخال رقم الهاتف' : 'Please enter your phone number')
            return
        }
        if (!selectedWilaya) {
            alert(locale === 'ar' ? 'يرجى اختيار الولاية' : 'Please select a wilaya')
            return
        }
        try {
            setOrderLoading(true)
            await addDoc(collection(db, 'orders'), {
                productId: product.id,
                productName: product.nameEn || product.name_en || product.name || '',
                productNameAr: product.nameAr || product.name || '',
                imageUrl: product.imageUrl || product.image || '',
                price: product.price,
                quantity,
                selectedSize,
                selectedColor,
                paymentMethod,
                customerName: custName,
                customerSurname: custSurname,
                customerPhone: custPhone,
                wilaya: selectedWilaya,
                commune: selectedCommune,
                address: addressDetails,
                status: 'pending',
                total: orderTotal,
                locale,
                createdAt: new Date(),
            })
            // Decrement stock count by ordered quantity (best-effort, won't fail the order)
            if (product.id && typeof product.id === 'string') {
                try {
                    await updateDoc(doc(db, 'products', product.id), {
                        stock: increment(-quantity)
                    })
                } catch (_) { }
            }
            setOrderSuccess(true)
            setTimeout(() => {
                setOrderSuccess(false)
                setShowOrderForm(false)
                setCustName('')
                setCustSurname('')
                setCustPhone('')
                setSelectedWilaya('')
                setSelectedCommune('')
                setAddressDetails('')
            }, 2000)
        } catch (err) {
            console.error('Order error:', err)
            alert(locale === 'ar' ? 'حدث خطأ، حاول مجدداً' : 'Something went wrong, please try again')
        } finally {
            setOrderLoading(false)
        }
    }

    const fetchGPSLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords
                    setAddressDetails(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
                },
                (err) => console.error('GPS error', err)
            )
        }
    }
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showSizeChart, setShowSizeChart] = useState(false)
    const [showDescription, setShowDescription] = useState(false)
    const [showWashCare, setShowWashCare] = useState(false)
    const [dragStart, setDragStart] = useState(0)
    const [dragCurrent, setDragCurrent] = useState(0)
    const [isDragging, setIsDragging] = useState(false)

    const handleDragStart = (e) => {
        setDragStart(e.clientX || e.touches?.[0]?.clientX)
        setIsDragging(true)
    }

    const handleDragMove = (e) => {
        if (!isDragging) return
        setDragCurrent(e.clientX || e.touches?.[0]?.clientX)
    }

    const handleDragEnd = (e) => {
        if (!isDragging) return
        setIsDragging(false)

        const diff = dragStart - dragCurrent
        const threshold = 50 // pixels

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swiped left, show next image
                setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
            } else {
                // Swiped right, show previous image
                setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
            }
        }

        setDragStart(0)
        setDragCurrent(0)
    }

    const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4)
    const isArabic = locale === 'ar'
    const productName = isArabic
        ? (product.nameAr || product.name || '')
        : (product.nameEn || product.name_en || product.name || '')
    const productDescription = isArabic ? product.description : (product.descriptionEn || product.description_en || product.description)

    return (
        <main className="min-h-screen textured-bg pt-16 sm:pt-20 pb-20">
            <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-12">
                {/* Product Detail */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-8 lg:mb-12"
                >
                    {/* Image Carousel */}
                    <div className="border border-[#D1CCC6] p-1.5">
                        <div
                            className="relative overflow-hidden aspect-4/5 bg-[#F0F0F0] cursor-grab active:cursor-grabbing select-none"
                            onMouseDown={handleDragStart}
                            onMouseMove={handleDragMove}
                            onMouseUp={handleDragEnd}
                            onMouseLeave={handleDragEnd}
                            onTouchStart={handleDragStart}
                            onTouchMove={handleDragMove}
                            onTouchEnd={handleDragEnd}
                        >
                            <motion.div
                                className="flex h-full"
                                style={{ width: `${Math.max(productImages.length, 1) * 100}%` }}
                                initial={{ x: 0 }}
                                animate={{ x: `-${currentImageIndex * (100 / Math.max(productImages.length, 1))}%` }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            >
                                {productImages.map((imgSrc, idx) => (
                                    <div
                                        key={idx}
                                        className="relative h-full shrink-0"
                                        style={{ width: `${100 / Math.max(productImages.length, 1)}%` }}
                                    >
                                        <Image
                                            src={cloudinaryOptimized(imgSrc)}
                                            alt={`${productName} - ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            priority
                                            unoptimized
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            draggable={false}
                                        />
                                    </div>
                                ))}
                            </motion.div>
                            {/* Dot indicators */}
                            {productImages.length > 1 && (
                                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                                    {productImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-black scale-125' : 'bg-[#999]'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
                        {/* Product Name & Price */}
                        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#D1CCC6]">
                            <h1 className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.05em] text-[#000000] flex-1 leading-tight">{productName}</h1>
                            <span className="text-xs sm:text-sm md:text-base font-medium text-[#000000] whitespace-nowrap">DA {product.price}</span>
                        </div>

                        {/* Color Selection - only if product has colors */}
                        {colors.length > 0 && (
                            <div>
                                <h3 className="text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] mb-3">{t.color}</h3>
                                <div className="flex gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm border transition-all ${selectedColor === color
                                                ? 'border-[#000000] border-dashed bg-[#000000] text-white'
                                                : 'border-[#D1CCC6] text-[#000000] hover:border-[#A67B5B]'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection - only if product has sizes */}
                        {sizes.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <h3 className="text-xs sm:text-sm md:text-base uppercase tracking-[0.2em]">{t.size}</h3>
                                    <button
                                        onClick={() => setShowSizeChart(true)}
                                        className="text-xs sm:text-sm text-[#A67B5B] hover:underline"
                                    >
                                        {t.sizeChart}
                                    </button>
                                </div>
                                <div className="flex gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm border transition-all ${selectedSize === size
                                                ? 'border-[#000000] border-dashed bg-[#000000] text-white'
                                                : 'border-[#D1CCC6] text-[#000000] hover:border-[#A67B5B]'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selection */}
                        <div>
                            <h3 className="text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] mb-3">{t.quantity}</h3>
                            <div className="flex items-center gap-3 border border-[#D1CCC6] w-fit">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-2 text-[#000000] hover:bg-[#F5F5F5] transition-colors"
                                >
                                    −
                                </button>
                                <span className="px-4 py-2 text-sm font-medium text-[#000000]">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-3 py-2 text-[#000000] hover:bg-[#F5F5F5] transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>



                        {/* Actions */}
                        {/* Show hint if required selection missing */}
                        {((colors.length > 1 && !selectedColor) || (sizes.length > 1 && !selectedSize)) && (
                            <p className="text-[11px] text-[#A67B5B] -mb-1">
                                {locale === 'ar'
                                    ? `${colors.length > 1 && !selectedColor ? 'اختر اللون' : ''} ${sizes.length > 1 && !selectedSize ? 'واختر المقاس' : ''}`.trim()
                                    : `Please select ${colors.length > 1 && !selectedColor ? 'a color' : ''}${colors.length > 1 && !selectedColor && sizes.length > 1 && !selectedSize ? ' and ' : ''}${sizes.length > 1 && !selectedSize ? 'a size' : ''}`
                                }
                            </p>
                        )}
                        <div className="relative flex gap-2 sm:gap-4 pt-2 sm:pt-4">
                            <button
                                onClick={() => setShowOrderForm(true)}
                                disabled={(colors.length > 1 && !selectedColor) || (sizes.length > 1 && !selectedSize)}
                                className="flex-1 bg-[#000000] text-white py-3 sm:py-4 hover:bg-[#333333] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#000000]"
                            >
                                <ShoppingBag size={18} />
                                {t.addToCart}
                            </button>
                            <button
                                onClick={async () => {
                                    if (!user) {
                                        setWishlistMsg(locale === 'ar' ? 'سجّل دخولك لحفظ المنتجات' : 'Sign in to save items')
                                        setTimeout(() => setWishlistMsg(''), 2500)
                                        return
                                    }
                                    await toggleWishlist(product.id)
                                }}
                                className={`p-3 sm:p-4 border transition-colors ${isInWishlist?.(product.id)
                                        ? 'border-[#A67B5B] text-[#A67B5B] bg-[#FDF6F0]'
                                        : 'border-[#D1CCC6] text-[#000000] hover:border-[#A67B5B]'
                                    }`}
                                aria-label={isInWishlist?.(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                                <Heart size={18} fill={isInWishlist?.(product.id) ? '#A67B5B' : 'none'} />
                            </button>
                            {wishlistMsg && (
                                <p className="absolute -bottom-6 right-0 text-[10px] text-[#A67B5B] whitespace-nowrap">{wishlistMsg}</p>
                            )}
                        </div>

                        {/* Order Form Modal */}
                        {showOrderForm && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100 p-4">
                                <div className="bg-white rounded max-w-md w-full max-h-[90vh] flex flex-col">
                                    <div className="flex items-center justify-between p-5 pb-3 border-b border-[#eee] shrink-0">
                                        <h3 className="text-lg font-medium">{t.order}</h3>
                                        <button
                                            onClick={() => setShowOrderForm(false)}
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-[#666] hover:text-black"
                                        >
                                            <X size={22} />
                                        </button>
                                    </div>
                                    <div className="space-y-3 overflow-y-auto p-5 pt-3">
                                        <div className="flex flex-col">
                                            <label className="text-xs text-black mb-1">{t.name} <span className="text-[#A67B5B]">*</span></label>
                                            <input
                                                type="text"
                                                placeholder={t.name}
                                                value={custName}
                                                onChange={(e) => setCustName(e.target.value)}
                                                required
                                                className="w-full border border-[#D1CCC6] p-2 text-black placeholder:text-[#666]"
                                            />
                                        </div>
                                        <div className="flex flex-col mt-2">
                                            <label className="text-xs text-black mb-1">{t.surname}</label>
                                            <input
                                                type="text"
                                                placeholder={t.surname}
                                                value={custSurname}
                                                onChange={(e) => setCustSurname(e.target.value)}
                                                className="w-full border border-[#D1CCC6] p-2 text-black placeholder:text-[#666]"
                                            />
                                        </div>
                                        <div className="flex flex-col mt-2">
                                            <label className="text-xs text-black mb-1">{t.phone}</label>
                                            <input
                                                type="text"
                                                placeholder={t.phone}
                                                value={custPhone}
                                                onChange={(e) => setCustPhone(e.target.value)}
                                                className="w-full border border-[#D1CCC6] p-2 text-black placeholder:text-[#666]"
                                                required
                                            />
                                        </div>
                                        {/* address fields */}
                                        <div className="flex gap-2 mt-2">
                                            <div className="flex flex-col flex-1">
                                                <label className="text-xs text-black mb-1">{t.wilaya}</label>
                                                <select
                                                    value={selectedWilaya}
                                                    onChange={(e) => {
                                                        setSelectedWilaya(e.target.value)
                                                        setSelectedCommune('')
                                                    }}
                                                    className="w-full border border-[#D1CCC6] p-2 text-black"
                                                >
                                                    <option value="">{t.wilaya}</option>
                                                    {wilayas.map((w) => (
                                                        <option key={w.name} value={w.name}>
                                                            {w.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex flex-col flex-1 ml-2">
                                                <label className="text-xs text-black mb-1">{t.commune}</label>
                                                <select
                                                    value={selectedCommune}
                                                    onChange={(e) => setSelectedCommune(e.target.value)}
                                                    className="w-full border border-[#D1CCC6] p-2 text-black"
                                                    disabled={!selectedWilaya}
                                                >
                                                    <option value="">{t.commune}</option>
                                                    {wilayas
                                                        .find((w) => w.name === selectedWilaya)
                                                        ?.communes.map((c) => (
                                                            <option key={c} value={c}>
                                                                {c}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="relative mt-2">
                                            <div className="flex flex-col">
                                                <label className="text-xs text-black mb-1">{t.address}</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder={t.address}
                                                        value={addressDetails}
                                                        onChange={(e) => setAddressDetails(e.target.value)}
                                                        className={`w-full border border-[#D1CCC6] p-2 text-black placeholder:text-[#666] ${isArabic ? 'pr-2 pl-16' : 'pl-2 pr-16'}`}
                                                    />
                                                    <button
                                                        onClick={fetchGPSLocation}
                                                        className={`absolute top-1/2 -translate-y-1/2 text-xs text-[#A67B5B] ${isArabic ? 'left-2' : 'right-2'}`}
                                                    >
                                                        {t.useGPS}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="uppercase text-xs mb-1">{t.paymentMethod}</h4>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setPaymentMethod('cashDZD')}
                                                    className={`flex-1 border py-1 px-2 text-xs ${paymentMethod === 'cashDZD' ? 'bg-black text-white' : ''}`}
                                                >
                                                    {t.cashDZD}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price summary */}
                                        <div className="border-t border-[#eee] pt-3 mt-1 space-y-1.5">
                                            <div className="flex justify-between text-sm font-semibold text-black">
                                                <span>{t.productPrice} {quantity > 1 ? `× ${quantity}` : ''}</span>
                                            </div>
                                        </div>

                                        {orderSuccess ? (
                                            <div className="w-full bg-green-600 text-white py-2 mt-4 text-center text-sm">
                                                {locale === 'ar' ? '✓ تم الطلب بنجاح!' : '✓ Order placed successfully!'}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleSubmitOrder}
                                                disabled={orderLoading}
                                                className="w-full bg-black text-white py-2 mt-4 disabled:opacity-50"
                                            >
                                                {orderLoading
                                                    ? (locale === 'ar' ? 'جاري الإرسال...' : 'Submitting...')
                                                    : t.order}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setShowOrderForm(false)}
                                            className="mt-2 text-sm text-[#A67B5B]"
                                        >
                                            {t.close}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Description Section */}
                        <div className="border-t border-[#D1CCC6] pt-4 sm:pt-6">
                            <button
                                onClick={() => setShowDescription(!showDescription)}
                                className="w-full flex items-center justify-between py-3 text-xs sm:text-sm uppercase tracking-[0.05em] text-[#000000] hover:text-[#A67B5B] transition-colors"
                            >
                                <span className="font-medium">{t.description}</span>
                                <span className="text-lg">{showDescription ? '−' : '+'}</span>
                            </button>
                            {showDescription && (
                                <div className="py-3 text-xs sm:text-sm text-[#666666] leading-relaxed">
                                    {productDescription}
                                </div>
                            )}
                        </div>

                        {/* Wash & Care Section */}
                        <div className="border-t border-[#D1CCC6]">
                            <button
                                onClick={() => setShowWashCare(!showWashCare)}
                                className="w-full flex items-center justify-between py-3 text-xs sm:text-sm uppercase tracking-[0.05em] text-[#000000] hover:text-[#A67B5B] transition-colors"
                            >
                                <span className="font-medium">{t.washCare}</span>
                                <span className="text-lg">{showWashCare ? '−' : '+'}</span>
                            </button>
                            {showWashCare && (
                                <div className="py-3 text-xs sm:text-sm text-[#666666] leading-relaxed">
                                    {product.washCare || t.washCareText}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-xl sm:text-2xl font-light mb-6 sm:mb-8">{t.relatedProducts}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                            {relatedProducts.map((p) => (
                                <motion.div
                                    key={p.id}
                                    whileHover={{ y: -4 }}
                                    className="group cursor-pointer"
                                >
                                    <Link href={`/${locale}/products/${p.id}`}
                                        className="block"
                                        prefetch={false}
                                    >
                                        <div className="relative aspect-4/5 overflow-hidden bg-gray-100 mb-2 sm:mb-4">
                                            {(p.imageUrl || p.images?.[0] || p.image) && (
                                                <Image
                                                    src={cloudinaryOptimized(p.imageUrl || p.images?.[0] || p.image)}
                                                    alt={isArabic ? (p.nameAr || p.name || '') : (p.nameEn || p.name_en || p.name || '')}
                                                    fill
                                                    unoptimized
                                                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                />
                                            )}
                                        </div>
                                        <h3 className="text-xs sm:text-sm font-normal text-[#000000]">{isArabic ? (p.nameAr || p.name || '') : (p.nameEn || p.name_en || p.name || '')}</h3>
                                        <span className="text-xs sm:text-sm text-[#000000]">DA {p.price}</span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Size Chart Modal */}
                {showSizeChart && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white flex items-center justify-between p-4 sm:p-6 border-b">
                                <h2 className="text-lg sm:text-xl font-light text-[#000000]">{t.sizeChart}</h2>
                                <button
                                    onClick={() => setShowSizeChart(false)}
                                    className="p-2 hover:bg-gray-100 text-[#000000] transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-4 sm:p-6 overflow-x-auto">
                                <table className="w-full text-xs sm:text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3 font-light">Size</th>
                                            <th className="text-left py-2 px-3 font-light">Chest</th>
                                            <th className="text-left py-2 px-3 font-light">Waist</th>
                                            <th className="text-left py-2 px-3 font-light">Length</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeChartData[locale].map((row) => (
                                            <tr key={row.size} className="border-b hover:bg-paper transition-colors">
                                                <td className="py-2 px-3">{row.size}</td>
                                                <td className="py-2 px-3">{row.chest}</td>
                                                <td className="py-2 px-3">{row.waist}</td>
                                                <td className="py-2 px-3">{row.length}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Custom Description Modal */}
                {false && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white max-w-md w-full"
                        >
                            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                                <h2 className="text-lg sm:text-xl font-light text-[#000000]">{t.customDescription}</h2>
                                <button
                                    onClick={() => setShowDescriptionModal(false)}
                                    className="p-2 hover:bg-gray-100 text-[#000000] transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-4 sm:p-6 space-y-4">
                                <textarea
                                    value={customDescription}
                                    onChange={(e) => setCustomDescription(e.target.value)}
                                    placeholder={t.descriptionPlaceholder}
                                    className="w-full h-32 p-3 border border-[#D1CCC6] resize-none focus:outline-none focus:border-[#A67B5B] text-sm text-[#000000]"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowDescriptionModal(false)}
                                        className="flex-1 py-2.5 border border-[#D1CCC6] text-[#000000] hover:border-[#A67B5B] transition-colors text-sm font-light"
                                    >
                                        {t.close}
                                    </button>
                                    <button
                                        onClick={() => setShowDescriptionModal(false)}
                                        className="flex-1 py-2.5 bg-[#000000] text-white hover:bg-[#333333] transition-colors text-sm font-light"
                                    >
                                        {t.save}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </main>
    )
}
