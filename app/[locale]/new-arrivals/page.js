import ProductGrid from '@/components/ProductGrid'

const translations = {
    ar: {
        title: 'المجموعة الجديدة',
        description: 'اكتشف أحدث إضافاتنا من التصاميم الفاخرة',
    },
    en: {
        title: 'New Arrivals',
        description: 'Discover our latest luxury designs',
    },
    fr: {
        title: 'Nouveautés',
        description: 'Découvrez nos dernières créations de luxe',
    }
}

export const metadata = {
    title: 'New Arrivals | HEMA',
    description: 'Discover the latest fashion collection',
}

export default async function NewArrivals({ params }) {
    const { locale } = await params
    const t = translations[locale] || translations.en

    return (
        <main className="min-h-screen pt-20">
            <div className="max-w-360 mx-auto px-6 lg:px-12 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-light mb-4 text-black" style={{ fontFamily: 'var(--font-playfair)' }}>{t.title}</h1>
                    <p className="text-black text-base" style={{ fontFamily: 'var(--font-inter)' }}>{t.description}</p>
                </div>
                <ProductGrid locale={locale} newArrivals />
            </div>
        </main>
    )
}
