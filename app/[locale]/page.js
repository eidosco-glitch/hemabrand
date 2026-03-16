import Hero from '@/components/Hero'
import ProductGrid from '@/components/ProductGrid'
import CollectionBanner from '@/components/CollectionBanner'
import BrandSections from '@/components/BrandSections'

export const revalidate = 3600 // re-generate page at most once per hour

export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'ar' }]
}

const brandContent = {
    ar: {
        tagline: '"الهمة عندها ناسها.. و أنت واحد منهم.."',
        storyTitle: 'قصتنا',
        storyBody: 'بدأت حكاية "همة" من شغف مشترك بين صديقين كبرا في شوارع الجزائر. أردنا علامة تجمع بين صخب الـ Streetwear العالمي والأنفة التي تميز الشاب الجزائري — لتحويل مفهوم "الهمة" من كلمة نتوارثها إلى أسلوب حياة نرتديه كل يوم.',
        readMore: 'اكتشف المزيد',
        valuesTitle: 'قيمنا',
        values: [
            { title: 'الهمة', desc: 'الطموح والثقة بالنفس في كل خطوة.' },
            { title: 'الأصالة', desc: 'احترام الجذور وإظهار الشخصية الحقيقية.' },
            { title: 'الإبداع', desc: 'لمسة مبتكرة وعصرية في كل تصميم.' },
            { title: 'المجتمع', desc: 'بناء مجتمع شبابي طموح ومبدع.' },
        ],
    },
    en: {
        tagline: '"HEMA has its people… and you are one of them."',
        storyTitle: 'Our Story',
        storyBody: 'HEMA was born from a shared passion between two friends who grew up in the streets of Algiers. We wanted a brand that merges global streetwear energy with the pride that defines Algerian youth — turning "Himma" from a word we inherited into a lifestyle we wear every day.',
        readMore: 'Read More',
        valuesTitle: 'Our Values',
        values: [
            { title: 'Hema', desc: 'Ambition and self-confidence in every step.' },
            { title: 'Authenticity', desc: 'Respecting our roots and showing our true selves.' },
            { title: 'Creativity', desc: 'A unique, modern touch in every design.' },
            { title: 'Community', desc: 'Building a network of ambitious, creative youth.' },
        ],
    },
}

export default async function Home({ params }) {
    const { locale } = await params
    const b = brandContent[locale] || brandContent.en
    const isRTL = locale === 'ar'

    return (
        <main className="bg-paper">
            <Hero locale={locale} />

            {/* Tagline */}
            <section className="pt-10 pb-4 px-6 text-center bg-white">
                <p className="text-2xl md:text-3xl font-light text-black tracking-wide max-w-2xl mx-auto" style={{ fontFamily: isRTL ? 'var(--font-amiri)' : 'Maharlika' }}>
                    {b.tagline}
                </p>
                <div className="mx-auto mt-6 h-px w-24 bg-[#D1CCC6]" />
            </section>

            <ProductGrid locale={locale} />
            <CollectionBanner locale={locale} />
            <BrandSections locale={locale} b={b} isRTL={isRTL} />
        </main>
    )
}
