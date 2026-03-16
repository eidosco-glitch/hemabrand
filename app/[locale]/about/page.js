'use client'

import { use, useState } from 'react'

const content = {
  ar: {
    tagline: '"الهمة عندها ناسها.. و أنت واحد منهم.."',
    sections: [
      {
        id: 'story',
        title: 'القصة',
        body: `بدأت حكاية "همة" (HEMA) من شغف مشترك بين صديقين مقربين، كبرا في شوارع الجزائر وتنفسا تفاصيلها. كنا نرى في كل زاوية طاقة شبابية مذهلة وأسلوب عفوي يبحث عن هوية.

سألنا أنفسنا: لماذا لا نصنع علامة تجارية تجمع بين صخب الـ Streetwear العالمي والأنفة والرزانة التي تميز الشاب الجزائري؟

من هنا انطلقت الرحلة. لم نرد مجرد ماركة ملابس، بل أردنا تحويل مفهوم "الهمة والشان" من كلمة نتوارثها إلى أسلوب حياة نرتديه كل يوم.

نحن هنا لنثبت أن الأناقة العصرية لا تتعارض مع الوقار الأصيل، وأن ملابسك هي لغتك الأولى التي تخبر العالم من أنت... قبل أن تتكلم.`,
      },
      {
        id: 'vision',
        title: 'رؤيتنا',
        body: `نريد أن نصنع مجتمعًا من الشباب الطموح، الواثق بنفسه، والمبدع بأسلوبه، مجتمعًا يعكس قيمه وروحه في كل قطعة HEMA.

رؤيتنا أن تصبح كل قطعة HEMA رسالة، وكل تصميم أسلوب حياة، وكل لباس انعكاسًا للشخصية والثقة بالنفس.`,
      },
      {
        id: 'values',
        title: 'قيمنا',
        body: `الهمة — الطموح، القوة، والثقة بالنفس في كل خطوة، لأن كل شاب يستحق أن يحلم ويحقق.

الأصالة — الاحترام لجذورنا وهويتنا، وإظهار شخصيتنا الحقيقية بدون تصنع.

الإبداع — لمسة مبتكرة وعصرية في كل تصميم، تجعل كل قطعة فريدة وتعكس أسلوبك الشخصي.

المجتمع — بناء مجتمع من الشباب الطموح والمبدع، يدعم بعضه البعض ويشارك القيم نفسها.

الجودة — منتجات تدوم، تجمع بين التصميم العصري والمواد عالية الجودة، لتكون أكثر من مجرد لباس... أسلوب حياة.`,
      },
      {
        id: 'mission',
        title: 'مهمتنا',
        body: `مهمتنا في HEMA هي تصميم ملابس تعكس شخصية الشباب الجزائري، طموحهم، وأسلوب حياتهم.

نهدف لبناء مجتمع من الشباب الواثق والمبدع، الذي يجد في كل قطعة رسالة، وفي كل تصميم أسلوب حياة يعبر عنه.

نؤمن أن الملابس ليست مجرد قماش... بل وسيلة للتعبير عن الذات، والثقة، والتميز.`,
      },
    ],
  },
  en: {
    tagline: '"HEMA has its people… and you are one of them."',
    sections: [
      {
        id: 'story',
        title: 'The Story',
        body: `The story of HEMA began with a shared passion between two close friends, who grew up in the streets of Algiers, absorbing every detail of its life and energy. Everywhere we looked, we saw amazing youthful energy and effortless style seeking its own identity.

We asked ourselves: Why not create a brand that combines the global vibrancy of streetwear with the pride and dignity that define the Algerian youth?

And so, the journey began. We didn't want just a clothing brand; we wanted to turn the concept of "Himma & Shān" — once just a word we inherited — into a lifestyle you wear every day.

We're here to show that modern style can coexist with timeless dignity, and that your clothes are your first language, telling the world who you are… before you even speak.`,
      },
      {
        id: 'vision',
        title: 'Our Vision',
        body: `We aim to build a community of ambitious, confident, and creatively expressive youth — a community that reflects its values and spirit in every HEMA piece.

Our vision is for every HEMA piece to be a message, every design a lifestyle, and every garment a reflection of personality and self-confidence.`,
      },
      {
        id: 'values',
        title: 'Core Values',
        body: `HEMA(Ambition & Drive) — Ambition, strength, and self-confidence in every step — because every young person deserves to dream big and achieve.

Authenticity — Respecting our roots and identity, showing our true selves without pretense.

Creativity — A unique, modern touch in every design, making each piece stand out and reflect your personal style.

Community — Building a network of ambitious, creative youth who support each other and share the same values.

Quality — Durable products that combine modern design with premium materials — more than just clothing… a lifestyle.`,
      },
      {
        id: 'mission',
        title: 'Our Mission',
        body: `Our mission at HEMA is to create clothing that reflects the personality, ambition, and lifestyle of Algerian youth.

We aim to build a community of confident, creative young people who find a message in every piece and a lifestyle in every design.

We believe that clothing is more than fabric… it's a way to express individuality, confidence, and distinction.`,
      },
    ],
  },
}

function Accordion({ title, body }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-[#D1CCC6]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-xs uppercase tracking-[0.12em] text-black hover:text-[#A67B5B] transition-colors"
      >
        <span className="font-medium">{title}</span>
        <span className="text-lg leading-none">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="pb-5 text-xs text-[#666] leading-relaxed whitespace-pre-line">
          {body}
        </div>
      )}
    </div>
  )
}

export default function About({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const locale = params?.locale || 'ar'
  const c = content[locale] || content.ar

  return (
    <main className="min-h-screen pt-20">
      <div className="max-w-360 mx-auto px-6 lg:px-12 py-16">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#A67B5B] mb-4">HEMA</p>
          <h1 className="text-2xl md:text-3xl font-light text-[#1A1A1A] mb-8 leading-snug">
            {c.tagline}
          </h1>
          <div className="border-b border-[#D1CCC6]" />
          {c.sections.map((s) => (
            <Accordion key={s.id} title={s.title} body={s.body} />
          ))}
        </div>
      </div>
    </main>
  )
}
