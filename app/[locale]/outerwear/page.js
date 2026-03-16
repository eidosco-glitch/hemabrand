import ProductGrid from '@/components/ProductGrid'

const translations = {
  ar: {
    title: 'السترات',
    description: 'مجموعة حصرية من السترات الفاخرة',
  },
  en: {
    title: 'Outerwear',
    description: 'Exclusive collection of luxury outerwear',
  }
}

export const metadata = {
  title: 'Outerwear | HEMA',
  description: 'Browse our premium outerwear collection',
}

export default async function Outerwear({ params }) {
  const { locale } = await params
  const t = translations[locale] || translations.en

  return (
    <main className="min-h-screen pt-20">
      <div className="max-w-360 mx-auto px-6 lg:px-12 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light mb-4">{t.title}</h1>
          <p className="text-muted text-lg">{t.description}</p>
        </div>
        <ProductGrid locale={locale} category="outerwear" />
      </div>
    </main>
  )
}
