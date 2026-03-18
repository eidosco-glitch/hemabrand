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
    tagline: '\u201CHEMA has its people\u2026 and you are one of them.\u201D',
    sections: [
      {
        id: 'story',
        title: 'The Story',
        body: `The story of HEMA began with a shared passion between two close friends, who grew up in the streets of Algiers, absorbing every detail of its life and energy. Everywhere we looked, we saw amazing youthful energy and effortless style seeking its own identity.

We asked ourselves: Why not create a brand that combines the global vibrancy of streetwear with the pride and dignity that define the Algerian youth?

And so, the journey began. We didn\u2019t want just a clothing brand; we wanted to turn the concept of \u201CHimma & Sh\u0101n\u201D \u2014 once just a word we inherited \u2014 into a lifestyle you wear every day.

We\u2019re here to show that modern style can coexist with timeless dignity, and that your clothes are your first language, telling the world who you are\u2026 before you even speak.`,
      },
      {
        id: 'vision',
        title: 'Our Vision',
        body: `We aim to build a community of ambitious, confident, and creatively expressive youth \u2014 a community that reflects its values and spirit in every HEMA piece.

Our vision is for every HEMA piece to be a message, every design a lifestyle, and every garment a reflection of personality and self-confidence.`,
      },
      {
        id: 'values',
        title: 'Core Values',
        body: `HEMA (Ambition & Drive) \u2014 Ambition, strength, and self-confidence in every step \u2014 because every young person deserves to dream big and achieve.

Authenticity \u2014 Respecting our roots and identity, showing our true selves without pretense.

Creativity \u2014 A unique, modern touch in every design, making each piece stand out and reflect your personal style.

Community \u2014 Building a network of ambitious, creative youth who support each other and share the same values.

Quality \u2014 Durable products that combine modern design with premium materials \u2014 more than just clothing\u2026 a lifestyle.`,
      },
      {
        id: 'mission',
        title: 'Our Mission',
        body: `Our mission at HEMA is to create clothing that reflects the personality, ambition, and lifestyle of Algerian youth.

We aim to build a community of confident, creative young people who find a message in every piece and a lifestyle in every design.

We believe that clothing is more than fabric\u2026 it\u2019s a way to express individuality, confidence, and distinction.`,
      },
    ],
  },
  fr: {
    tagline: '\u201CHEMA a ses gens... et vous en faites partie.\u201D',
    sections: [
      {
        id: 'story',
        title: 'L\'Histoire',
        body: `L'histoire de HEMA a commenc\u00E9 par une passion partag\u00E9e entre deux amis proches qui ont grandi dans les rues d'Alger, en respirant ses d\u00E9tails. Nous voyions une \u00E9nergie juv\u00E9nile incroyable \u00E0 chaque coin de rue et un style spontan\u00E9 cherchant une identit\u00E9.

Nous nous sommes demand\u00E9 : Pourquoi ne pas cr\u00E9er une marque qui combine l'effervescence du Streetwear mondial avec la fiert\u00E9 et la dignit\u00E9 qui distinguent la jeunesse alg\u00E9rienne ?

De l\u00E0, le voyage a commenc\u00E9. Nous ne voulions pas juste une marque de v\u00EAtements ; nous voulions transformer le concept de "Hemma & Shan" d'un mot h\u00E9rit\u00E9 en un style de vie que nous portons tous les jours.

Nous sommes ici pour prouver que l'\u00E9l\u00E9gance moderne ne s'oppose pas \u00E0 la dignit\u00E9 authentique, et que vos v\u00EAtements sont votre premi\u00E8re langue qui dit au monde qui vous \u00EAtes... avant m\u00EAme de parler.`,
      },
      {
        id: 'vision',
        title: 'Notre Vision',
        body: `Nous voulons cr\u00E9er une communaut\u00E9 de jeunes ambitieux, confiants et cr\u00E9atifs dans leur style \u2014 une communaut\u00E9 qui refl\u00E8te ses valeurs et son esprit dans chaque pi\u00E8ce HEMA.

Notre vision est que chaque pi\u00E8ce HEMA soit un message, chaque design un style de vie, et chaque v\u00EAtement un reflet de la personnalit\u00E9 et de la confiance en soi.`,
      },
      {
        id: 'values',
        title: 'Nos Valeurs',
        body: `Hemma (Ambition) \u2014 Ambition, force et confiance en soi \u00E0 chaque \u00E9tape, car chaque jeune m\u00E9rite de r\u00EAver et de r\u00E9aliser.

Authenticit\u00E9 \u2014 Respect de nos racines et de notre identit\u00E9, montrant notre vrai caract\u00E8re sans pr\u00E9tention.

Cr\u00E9ativit\u00E9 \u2014 Une touche innovante et moderne dans chaque design, rendant chaque pi\u00E8ce unique et refl\u00E9tant votre style personnel.

Communaut\u00E9 \u2014 Construire une communaut\u00E9 de jeunes ambitieux et cr\u00E9atifs qui se soutiennent mutuellement et partagent les m\u00EAmes valeurs.

Qualit\u00E9 \u2014 Des produits qui durent, combinant design moderne et mat\u00E9riaux de haute qualit\u00E9 pour \u00EAtre plus qu'un simple v\u00EAtement... un style de vie.`,
      },
      {
        id: 'mission',
        title: 'Notre Mission',
        body: `Notre mission chez HEMA est de concevoir des v\u00EAtements qui refl\u00E8tent la personnalit\u00E9, l'ambition et le style de vie de la jeunesse alg\u00E9rienne.

Nous visons \u00E0 construire une communaut\u00E9 de jeunes confiants et cr\u00E9atifs qui trouvent un message dans chaque pi\u00E8ce et un style de vie qui les exprime dans chaque design.

Nous croyons que les v\u00EAtements ne sont pas juste du tissu... mais un moyen d'expression de soi, de confiance et de distinction.`,
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
        <span className="text-lg leading-none">{open ? '\u2212' : '+'}</span>
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
  const locale = params?.locale || 'en'
  const c = content[locale] || content.en

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
