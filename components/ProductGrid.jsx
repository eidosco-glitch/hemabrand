'use client'

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { products as staticProducts } from '@/lib/products'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function ProductGrid({ locale }) {
    const [products, setProducts] = useState(staticProducts)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'products'))
                if (!snapshot.empty) {
                    const firestoreProducts = snapshot.docs.map(docSnap => ({
                        id: docSnap.id,
                        ...docSnap.data(),
                        // normalize field names so ProductCard works
                        image: docSnap.data().imageUrl || '',
                        name: docSnap.data().nameAr || docSnap.data().nameEn || '',
                        name_en: docSnap.data().nameEn || '',
                    }))
                    setProducts(firestoreProducts)
                }
            } catch (err) {
                console.error('Failed to load products from Firestore:', err)
                // static fallback remains
            }
        }
        fetchProducts()
    }, [])

    return (
        <section id="products" className="py-20 md:py-32 px-2 md:px-3 lg:px-6 max-w-[1440px] mx-auto bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} locale={locale} />
                ))}
            </div>
        </section>
    )
}