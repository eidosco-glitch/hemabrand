'use client'

import { motion } from 'framer-motion'

const testimonials = [
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
]

export default function Testimonials() {
  return (
    <section className="py-20 md:py-32 px-6 lg:px-12 max-w-[1440px] mx-auto bg-white">
      <div className="text-center mb-16">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">آراء العملاء</h2>
        <div className="w-12 h-[1px] bg-[#A67B5B] mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {testimonials.map((item, index) => (
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