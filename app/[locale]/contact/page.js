'use client'

import { motion } from 'framer-motion'

const translations = {
    ar: {
        contact: 'اتصل بنا',
        email: 'البريد الإلكتروني',
        phone: 'الهاتف',
        address: 'العنوان',
        message: 'الرسالة',
        send: 'إرسال',
        name: 'الاسم',
        contactInfo: 'معلومات التواصل',
        getInTouch: 'تواصل معنا',
    },
    en: {
        contact: 'Contact Us',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        message: 'Message',
        send: 'Send',
        name: 'Name',
        contactInfo: 'Contact Information',
        getInTouch: 'Get In Touch',
    }
}

export default function Contact({ params: { locale } }) {
    const t = translations[locale] || translations.ar
    const isArabic = locale === 'ar'

    return (
        <main className="min-h-screen bg-paper pt-20 pb-20">
            <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-light mb-4">{t.contact}</h1>
                    <p className="text-sm sm:text-base text-[#808080]">{t.getInTouch}</p>
                </motion.div>

                {/* Contact Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <form className="space-y-6">
                            <div>
                                <label className="block text-xs sm:text-sm uppercase tracking-[0.2em] mb-3">
                                    {t.name}
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-[#D1CCC6] rounded focus:outline-none focus:border-[#A67B5B] text-sm"
                                    placeholder={t.name}
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm uppercase tracking-[0.2em] mb-3">
                                    {t.email}
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 border border-[#D1CCC6] rounded focus:outline-none focus:border-[#A67B5B] text-sm"
                                    placeholder={t.email}
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm uppercase tracking-[0.2em] mb-3">
                                    {t.message}
                                </label>
                                <textarea
                                    rows="6"
                                    className="w-full px-4 py-3 border border-[#D1CCC6] rounded resize-none focus:outline-none focus:border-[#A67B5B] text-sm"
                                    placeholder={t.message}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#000000] text-white py-3 sm:py-4 rounded hover:bg-[#333333] transition-colors font-light text-sm sm:text-base"
                            >
                                {t.send}
                            </button>
                        </form>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col justify-center space-y-8"
                    >
                        <div>
                            <h3 className="text-sm uppercase tracking-[0.2em] font-semibold mb-2">{t.contactInfo}</h3>
                            <p className="text-[#808080] text-sm leading-relaxed">
                                {isArabic
                                    ? 'نرحب باستفساراتك وتعليقاتك. يرجى التواصل معنا عبر البيانات أدناه.'
                                    : 'We would love to hear from you. Please reach out using the contact details below.'}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs uppercase tracking-[0.2em] font-light mb-2">{t.email}</h4>
                            <a
                                href="mailto:contact@hemaapparel.com"
                                className="text-[#A67B5B] hover:text-[#8B6A47] transition-colors text-sm"
                            >
                                contact@hemaapparel.com
                            </a>
                        </div>

                        <div>
                            <h4 className="text-xs uppercase tracking-[0.2em] font-light mb-2">{t.phone}</h4>
                            <a
                                href="tel:+213123456789"
                                className="text-[#A67B5B] hover:text-[#8B6A47] transition-colors text-sm"
                            >
                                +213 (0) 123 456 789
                            </a>
                        </div>

                        <div>
                            <h4 className="text-xs uppercase tracking-[0.2em] font-light mb-2">{t.address}</h4>
                            <p className="text-[#808080] text-sm">
                                {isArabic
                                    ? 'الجزائر\nالعاصمة\nديوان الشارقة'
                                    : 'Algeria\nAlgiers\nDiwan Al Sharjah'}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}
