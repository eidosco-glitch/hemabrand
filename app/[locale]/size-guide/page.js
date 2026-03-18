'use client'

const content = {
    ar: {
        title: 'دليل المقاسات',
        subtitle: 'اختر مقاسك بثقة',
        howTo: 'كيف تقيس نفسك',
        howToSteps: [
            { label: 'الصدر', desc: 'قس المحيط الأكبر لصدرك، مع إبقاء الشريط أفقياً.' },
            { label: 'الخصر', desc: 'قس الجزء الأضيق من خصرك، عادةً فوق السرة بقليل.' },
            { label: 'الورك', desc: 'قس المحيط الأكبر للورك والأرداف.' },
            { label: 'الطول', desc: 'قف باستقامة وقس من قمة الرأس حتى الكعب.' },
        ],
        tops: 'الجزء العلوي — القمصان والسترات',
        bottoms: 'الجزء السفلي — البناطيل',
        size: 'المقاس',
        chest: 'الصدر (سم)',
        waist: 'الخصر (سم)',
        hips: 'الورك (سم)',
        length: 'الطول (سم)',
        note: 'جميع القياسات بالسنتيمتر. إذا كنت بين مقاسين اختر الأكبر.',
    },
    en: {
        title: 'Size Guide',
        subtitle: 'Find your perfect fit',
        howTo: 'How to Measure',
        howToSteps: [
            { label: 'Chest', desc: 'Measure the fullest part of your chest, keeping the tape horizontal.' },
            { label: 'Waist', desc: 'Measure the narrowest part of your waist, just above the navel.' },
            { label: 'Hips', desc: 'Measure the fullest part of your hips and seat.' },
            { label: 'Length', desc: 'Stand straight and measure from the top of your head to your heel.' },
        ],
        tops: 'Tops — Shirts & Outerwear',
        bottoms: 'Bottoms — Trousers',
        size: 'Size',
        chest: 'Chest (cm)',
        waist: 'Waist (cm)',
        hips: 'Hips (cm)',
        length: 'Length (cm)',
        note: 'All measurements are in centimetres. If you are between sizes, choose the larger one.',
    },
    fr: {
        title: 'Guide des Tailles',
        subtitle: 'Trouvez votre taille parfaite',
        howTo: 'Comment se mesurer',
        howToSteps: [
            { label: 'Poitrine', desc: 'Mesurez la partie la plus large de votre poitrine, en gardant le ruban horizontal.' },
            { label: 'Taille', desc: 'Mesurez la partie la plus étroite de votre taille, juste au-dessus du nombril.' },
            { label: 'Hanches', desc: 'Mesurez la partie la plus large de vos hanches.' },
            { label: 'Longueur', desc: 'Tenez-vous droit et mesurez du sommet de la tête au talon.' },
        ],
        tops: 'Hauts — Chemises & Vestes',
        bottoms: 'Bas — Pantalons',
        size: 'Taille',
        chest: 'Poitrine (cm)',
        waist: 'Taille (cm)',
        hips: 'Hanches (cm)',
        length: 'Longueur (cm)',
        note: 'Toutes les mesures sont en centimètres. Si vous êtes entre deux tailles, choisissez la plus grande.',
    },
}

const topsData = [
    { size: 'XS', chest: '86–91', waist: '71–76', length: '68' },
    { size: 'S', chest: '91–96', waist: '76–81', length: '70' },
    { size: 'M', chest: '96–101', waist: '81–86', length: '72' },
    { size: 'L', chest: '101–106', waist: '86–91', length: '74' },
    { size: 'XL', chest: '106–111', waist: '91–96', length: '76' },
    { size: 'XXL', chest: '111–116', waist: '96–101', length: '78' },
]

const bottomsData = [
    { size: 'XS', waist: '71–76', hips: '86–91', length: '98' },
    { size: 'S', waist: '76–81', hips: '91–96', length: '100' },
    { size: 'M', waist: '81–86', hips: '96–101', length: '102' },
    { size: 'L', waist: '86–91', hips: '101–106', length: '104' },
    { size: 'XL', waist: '91–96', hips: '106–111', length: '106' },
    { size: 'XXL', waist: '96–101', hips: '111–116', length: '108' },
]

function SizeTable({ headers, rows }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-[11px] uppercase tracking-[0.08em]">
                <thead>
                    <tr className="border-b border-[#D1CCC6]">
                        {headers.map((h) => (
                            <th key={h} className="text-left py-2.5 pr-6 font-medium text-[#1A1A1A]">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-b border-[#EDEBE8]">
                            {Object.values(row).map((val, j) => (
                                <td key={j} className={`py-2.5 pr-6 ${j === 0 ? 'font-medium text-[#1A1A1A]' : 'text-[#666]'}`}>{val}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

import { useParams } from 'next/navigation'

// ... existing code ...

export default function SizeGuide() {
    const params = useParams()
    const locale = params?.locale || 'en'
    const c = content[locale] || content.en

    return (
        <main className="min-h-screen pt-20">
            <div className="max-w-360 mx-auto px-6 lg:px-12 py-16">
                <div className="max-w-xl">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-[#A67B5B] mb-3">HEMA</p>
                    <h1 className="text-2xl md:text-3xl font-light text-[#1A1A1A] mb-10">{c.title}</h1>

                    {/* How to measure */}
                    <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#666] mb-4">{c.howTo}</h2>
                    <div className="grid grid-cols-2 gap-4 mb-12">
                        {c.howToSteps.map((step) => (
                            <div key={step.label} className="border-t border-[#D1CCC6] pt-3">
                                <p className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#1A1A1A] mb-1">{step.label}</p>
                                <p className="text-[11px] text-[#666] leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tops table */}
                    <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#666] mb-4">{c.tops}</h2>
                    <div className="mb-10">
                        <SizeTable
                            headers={[c.size, c.chest, c.waist, c.length]}
                            rows={topsData.map(r => ({ size: r.size, chest: r.chest, waist: r.waist, length: r.length }))}
                        />
                    </div>

                    {/* Bottoms table */}
                    <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#666] mb-4">{c.bottoms}</h2>
                    <div className="mb-10">
                        <SizeTable
                            headers={[c.size, c.waist, c.hips, c.length]}
                            rows={bottomsData.map(r => ({ size: r.size, waist: r.waist, hips: r.hips, length: r.length }))}
                        />
                    </div>

                    <p className="text-[10px] text-[#888] leading-relaxed border-t border-[#D1CCC6] pt-4">{c.note}</p>
                </div>
            </div>
        </main>
    )
}
