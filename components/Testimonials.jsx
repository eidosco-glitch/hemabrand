'use client'

import { motion } from 'framer-motion'

const testimonials = {
  ar: [
    {
      text: 'توقعت أفضل مما كانت الجودة! تجربة تسوق رائعة والتوصيل تم في وقت قياسي. سأطلب مرة أخرى بالتأكيد.',
      author: 'ياسين الجزائري',
    },
    {
      text: 'موقع احترافي جداً وراقية منتجات رجالية تلبي كافة الاحتياجات. خدمة العملاء كانت متعاونة للغاية.',
      author: 'كريم بن علي',
    },
    {
      text: 'أفضل منصة إلكترونية جربتها في الجزائر. نظام الطلب سهل جداً والمنتجات أصلية 100%.',
      author: 'أحمد محمود',
    },
  ],
  en: [
    {
      text: 'Quality exceeded my expectations! Great shopping experience and delivery was super fast.',
      author: 'Yacine ALG',
    },
    {
      text: 'Very professional site and premium men products. Customer service was extremely helpful.',
      author: 'Karim Ben Ali',
    },
    {
      text: 'Best e-commerce platform I tried in Algeria. Ordering is easy and products are 100% authentic.',
      author: 'Ahmed Mahmoud',
    },
  ],
  fr: [
    {
      text: 'La qualité a dépassé mes attentes ! Super expérience d\'achat et la livraison a été très rapide.',
      author: 'Yacine ALG',
    },
    {
      text: 'Site très professionnel et produits haut de gamme. Le service client était extrêmement serviable.',
      author: 'Karim Ben Ali',
    },
    {
      text: 'Meilleure plateforme e-commerce que j\'ai essayée en Algérie. La commande est facile et les produits sont 100% authentiques.',
      author: 'Ahmed Mahmoud',
    },
  ],
}

export default function Testimonials({ locale = 'en' }) {
  const list = testimonials[locale] || testimonials.en
  const title = locale === 'ar' ? 'آراء العملاء' : locale === 'fr' ? 'Avis Clients' : 'Customer Reviews'

  return (
    <section className="py-20 md:py-32 px-6 lg:px-12 max-w-[1440px] mx-auto bg-white">
      <div className="text-center mb-16">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">{title}</h2>
        <div className="w-12 h-[1px] bg-[#A67B5B] mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {list.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="relative mb-6">
              <span className="text-6xl text-[#E8E6E3] font-serif leading-none absolute -top-4 left-1/2 -translate-x-1/2">"</span>
              <p className="text-lg font-light leading-relaxed pt-4">{item.text}</p>
            </div>
            <span className="text-sm text-[#6B6B6B]">{item.author}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}