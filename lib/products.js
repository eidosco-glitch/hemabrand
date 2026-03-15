import { db } from '@/lib/firebase'
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore'

// Static fallback products (shown before Firestore loads) — no placeholder images
export const products = [
    {
        id: 1,
        name: 'سويت شيرت بياقة مستديرة فاخر',
        name_en: 'Luxury Crew Neck Sweatshirt',
        price: 4900,
        originalPrice: 6500,
        image: '',
        description: 'تصميم فاخر من أفضل الأقمشة',
        description_en: 'Premium design crafted from the finest fabrics',
    },
    {
        id: 2,
        name: 'سروال جينز مخروطي',
        name_en: 'Tapered Denim Jeans',
        price: 3800,
        originalPrice: 5200,
        image: '',
        description: 'جينز مخروطي جودة عالية',
        description_en: 'Premium quality tapered fit denim',
    },
    {
        id: 3,
        name: 'معطف محدد فاخر',
        name_en: 'Luxury Fitted Coat',
        price: 12500,
        originalPrice: 16000,
        image: '',
        description: 'معطف فاخر بتصميم محدد',
        description_en: 'Designer luxury coat with fitted silhouette',
    },
    {
        id: 4,
        name: 'قميص بولو كلاسيكي',
        name_en: 'Classic Polo Shirt',
        price: 2900,
        image: '',
        description: 'قميص بولو كلاسيكي أنيق',
        description_en: 'Elegant classic polo shirt',
    },
    {
        id: 5,
        name: 'بنطلون تشينو ضيق أساسي',
        name_en: 'Essential Tapered Chino Pants',
        price: 4200,
        originalPrice: 5500,
        image: '',
        description: 'بنطلون تشينو ضيق من الأساسيات',
        description_en: 'Wardrobe essential tapered chino pants',
    },
    {
        id: 6,
        name: 'كتة بياقة مستديرة فاخرة',
        name_en: 'Luxury Crew Neck T-Shirt',
        price: 6800,
        image: '',
        description: 'كتة فاخرة برقبة مستديرة',
        description_en: 'Luxury crew neck t-shirt',
    },
]

export function getProductById(id) {
    return products.find(p => p.id === parseInt(id))
}

// Fetch a single product from Firestore by Firestore doc ID or numeric ID
export async function getProductByIdFromFirestore(id) {
    try {
        // Try Firestore doc ID first (string)
        const docRef = doc(db, 'products', String(id))
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() }
        }
    } catch (_) { }
    // Fall back to static data
    return getProductById(id)
}

// Fetch all products from Firestore
export async function getAllProductsFromFirestore() {
    try {
        const snapshot = await getDocs(collection(db, 'products'))
        if (!snapshot.empty) {
            return snapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data(),
                image: docSnap.data().imageUrl || '',
                name: docSnap.data().nameAr || docSnap.data().nameEn || '',
                name_en: docSnap.data().nameEn || '',
            }))
        }
    } catch (err) {
        console.error('Firestore fetch error:', err)
    }
    return products
}
