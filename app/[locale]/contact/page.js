'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

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
        sending: 'جاري الإرسال...',
        sent: 'تم إرسال رسالتك بنجاح!',
        error: 'حدث خطأ، حاول مجدداً',
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
        sending: 'Sending...',
        sent: 'Your message has been sent successfully!',
        error: 'Something went wrong, please try again',
    },
    fr: {
        contact: 'Contactez-nous',
        email: 'E-mail',
        phone: 'Téléphone',
        address: 'Adresse',
        message: 'Message',
        send: 'Envoyer',
        name: 'Nom',
        contactInfo: 'Informations de contact',
        getInTouch: 'Prenez contact',
        sending: 'Envoi en cours...',
        sent: 'Votre message a été envoyé avec succès !',
        error: 'Une erreur est survenue, veuillez réessayer',
    }
}

export default function Contact() {
    const { locale } = useParams()
    const t = translations[locale] || translations.en
    const isArabic = locale === 'ar'

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState('idle') // idle | sending | sent | error

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name || !email || !message) return
        try {
            setStatus('sending')
            await addDoc(collection(db, 'contactMessages'), {
                name,
                email,
                message,
                locale,
                createdAt: new Date(),
                read: false,
            })
            setStatus('sent')
            setName(''); setEmail(''); setMessage('')
            setTimeout(() => setStatus('idle'), 3000)
        } catch {
            setStatus('error')
            setTimeout(() => setStatus('idle'), 3000)
        }
    }

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
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs sm:text-sm uppercase tracking-[0.2em] mb-3">
                                    {t.name}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
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
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-4 py-3 border border-[#D1CCC6] rounded resize-none focus:outline-none focus:border-[#A67B5B] text-sm"
                                    placeholder={t.message}
                                />
                            </div>

                            {status === 'sent' && <p className="text-sm text-green-600">{t.sent}</p>}
                            {status === 'error' && <p className="text-sm text-red-600">{t.error}</p>}

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full bg-[#000000] text-white py-3 sm:py-4 rounded hover:bg-[#333333] transition-colors font-light text-sm sm:text-base disabled:opacity-50"
                            >
                                {status === 'sending' ? t.sending : t.send}
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
                                href="mailto:contact.hemawear@gmail.com"
                                className="text-[#A67B5B] hover:text-[#8B6A47] transition-colors text-sm"
                            >
                                contact.hemawear@gmail.com
                            </a>
                        </div>

                        <div>
                            <h4 className="text-xs uppercase tracking-[0.2em] font-light mb-2">{t.phone}</h4>
                            <a
                                href="tel:+213541955934"
                                className="text-[#A67B5B] hover:text-[#8B6A47] transition-colors text-sm"
                            >
                                +213 541 955 934
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}
