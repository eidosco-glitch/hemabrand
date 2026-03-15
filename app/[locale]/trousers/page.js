import ProductGrid from '@/components/ProductGrid'

const translations = {
    ar: {
        title: 'السراويل',
        description: 'مجموعة حصرية من السراويل الفاخرة',
    },
    en: {
        title: 'Trousers',
        description: 'Exclusive collection of luxury trousers',
    }
}

export const metadata = {
    title: 'Trousers | HEMA',
    description: 'Browse our premium trousers collection',
}

export default function Trousers({ params }) {
    const { locale } = params
    const t = translations[locale] || translations.en

    return (
        <main className="min-h-screen pt-20">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-light mb-4">{t.title}</h1>
                    <p className="text-muted text-lg">{t.description}</p>
                </div>
                <ProductGrid locale={locale} category="trousers" />
            </div>
        </main>
    )
}
