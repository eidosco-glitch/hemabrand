'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

const ui = {
    ar: {
        signIn: 'تسجيل الدخول',
        signUp: 'إنشاء حساب',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        name: 'الاسم الكامل',
        confirmPassword: 'تأكيد كلمة المرور',
        continueGoogle: 'المتابعة مع Google',
        or: 'أو',
        passwordMismatch: 'كلمات المرور غير متطابقة',
    },
    en: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
        email: 'Email',
        password: 'Password',
        name: 'Full Name',
        confirmPassword: 'Confirm Password',
        continueGoogle: 'Continue with Google',
        or: 'Or',
        passwordMismatch: "Passwords don't match",
    },
    fr: {
        signIn: 'Se Connecter',
        signUp: 'S\'inscrire',
        email: 'E-mail',
        password: 'Mot de passe',
        name: 'Nom Complet',
        confirmPassword: 'Confirmer le mot de passe',
        continueGoogle: 'Continuer avec Google',
        or: 'Ou',
        passwordMismatch: 'Les mots de passe ne correspondent pas',
    },
}

function friendlyError(code, locale) {
    const map = {
        'auth/user-not-found': {
            en: 'No account found with this email.',
            ar: 'لا يوجد حساب بهذا البريد.',
            fr: 'Aucun compte trouvé avec cet e-mail.'
        },
        'auth/wrong-password': {
            en: 'Incorrect password.',
            ar: 'كلمة المرور غير صحيحة.',
            fr: 'Mot de passe incorrect.'
        },
        'auth/email-already-in-use': {
            en: 'This email is already registered.',
            ar: 'هذا البريد مسجل بالفعل.',
            fr: 'Cet e-mail est déjà enregistré.'
        },
        'auth/weak-password': {
            en: 'Password must be at least 6 characters.',
            ar: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.',
            fr: 'Le mot de passe doit contenir au moins 6 caractères.'
        },
        'auth/invalid-email': {
            en: 'Please enter a valid email.',
            ar: 'يرجى إدخال بريد إلكتروني صالح.',
            fr: 'Veuillez entrer un e-mail valide.'
        },
        'auth/too-many-requests': {
            en: 'Too many attempts. Please try again later.',
            ar: 'محاولات كثيرة جداً. يرجى المحاولة لاحقاً.',
            fr: 'Trop de tentatives. Veuillez réessayer plus tard.'
        },
        'auth/invalid-credential': {
            en: 'Incorrect email or password.',
            ar: 'البريد أو كلمة المرور غير صحيحة.',
            fr: 'E-mail ou mot de passe incorrect.'
        },
    }
    const msg = map[code]
    if (!msg) return locale === 'ar' ? 'حدث خطأ ما.' : locale === 'fr' ? 'Une erreur est survenue.' : 'Something went wrong.'
    return msg[locale] || msg.en
}

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
            <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
        </svg>
    )
}

export default function AuthOverlay({ locale, isOpen, onClose }) {
    const [tab, setTab] = useState('signin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const isRTL = locale === 'ar'
    const t = ui[locale] || ui.en

    const reset = () => {
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setName('')
        setError('')
        setShowPassword(false)
        setTab('signin')
    }

    const handleClose = useCallback(() => {
        reset()
        onClose()
    }, [onClose])

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') handleClose() }
        if (isOpen) window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [isOpen, handleClose])

    const switchTab = (next) => {
        setTab(next)
        setError('')
    }

    const handleEmailAuth = async (e) => {
        e.preventDefault()
        setError('')
        if (tab === 'signup' && password !== confirmPassword) {
            setError(t.passwordMismatch)
            return
        }
        setLoading(true)
        try {
            if (tab === 'signin') {
                await signInWithEmailAndPassword(auth, email, password)
            } else {
                const cred = await createUserWithEmailAndPassword(auth, email, password)
                if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() })
            }
            handleClose()
        } catch (err) {
            const msg = friendlyError(err.code, locale)
            if (msg) setError(msg)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogle = async () => {
        setError('')
        setLoading(true)
        try {
            await signInWithPopup(auth, new GoogleAuthProvider())
            handleClose()
        } catch (err) {
            const msg = friendlyError(err.code, locale)
            if (msg) setError(msg)
        } finally {
            setLoading(false)
        }
    }

    const inputBase = `w-full border border-[#E8DDD5] rounded-lg py-3 text-sm text-[#1A1A1A] placeholder:text-[#999] bg-white outline-none focus:border-[#A67B5B] transition-colors`
    const fontStyle = { fontFamily: isRTL ? 'var(--font-cairo)' : 'var(--font-inter)' }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-70 bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-0 left-0 right-0 z-80 bg-[#F8F3EE] shadow-2xl"
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        {/* Tab Header */}
                        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between h-16 border-b border-[#E8DDD5]">
                            <div className="flex gap-6">
                                <button
                                    onClick={() => switchTab('signin')}
                                    style={fontStyle}
                                    className={`text-sm tracking-widest uppercase pb-0.5 transition-colors ${tab === 'signin' ? 'text-[#1A1A1A] border-b border-[#1A1A1A]' : 'text-[#999] hover:text-[#1A1A1A]'}`}
                                >
                                    {t.signIn}
                                </button>
                                <button
                                    onClick={() => switchTab('signup')}
                                    style={fontStyle}
                                    className={`text-sm tracking-widest uppercase pb-0.5 transition-colors ${tab === 'signup' ? 'text-[#1A1A1A] border-b border-[#1A1A1A]' : 'text-[#999] hover:text-[#1A1A1A]'}`}
                                >
                                    {t.signUp}
                                </button>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-1.5 hover:bg-black/5 rounded-full transition-colors text-[#1A1A1A]"
                                aria-label="Close"
                            >
                                <X size={20} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <div className="max-w-sm mx-auto px-4 py-8">
                            {/* Google */}
                            <button
                                type="button"
                                onClick={handleGoogle}
                                disabled={loading}
                                style={fontStyle}
                                className="w-full flex items-center justify-center gap-3 border border-[#E8DDD5] rounded-lg py-3 text-sm text-[#1A1A1A] bg-white hover:bg-[#F8F3EE] transition-colors disabled:opacity-50"
                            >
                                <GoogleIcon />
                                {t.continueGoogle}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3 my-5">
                                <div className="flex-1 h-px bg-[#E8DDD5]" />
                                <span className="text-xs text-[#999]" style={{ fontFamily: 'var(--font-inter)' }}>{t.or}</span>
                                <div className="flex-1 h-px bg-[#E8DDD5]" />
                            </div>

                            {/* Email/Password Form */}
                            <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">

                                {/* Name (sign up only) */}
                                {tab === 'signup' && (
                                    <div className="relative">
                                        <User size={15} className={`absolute top-1/2 -translate-y-1/2 text-[#bbb] pointer-events-none ${isRTL ? 'right-3' : 'left-3'}`} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder={t.name}
                                            style={fontStyle}
                                            className={`${inputBase} ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
                                        />
                                    </div>
                                )}

                                {/* Email */}
                                <div className="relative">
                                    <Mail size={15} className={`absolute top-1/2 -translate-y-1/2 text-[#bbb] pointer-events-none ${isRTL ? 'right-3' : 'left-3'}`} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder={t.email}
                                        required
                                        autoComplete="email"
                                        style={fontStyle}
                                        className={`${inputBase} ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
                                    />
                                </div>

                                {/* Password */}
                                <div className="relative">
                                    <Lock size={15} className={`absolute top-1/2 -translate-y-1/2 text-[#bbb] pointer-events-none ${isRTL ? 'right-3' : 'left-3'}`} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder={t.password}
                                        required
                                        autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                                        style={fontStyle}
                                        className={`${inputBase} ${isRTL ? 'pr-9 pl-9' : 'pl-9 pr-9'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        className={`absolute top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#1A1A1A] transition-colors ${isRTL ? 'left-3' : 'right-3'}`}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>

                                {/* Confirm Password (sign up only) */}
                                {tab === 'signup' && (
                                    <div className="relative">
                                        <Lock size={15} className={`absolute top-1/2 -translate-y-1/2 text-[#bbb] pointer-events-none ${isRTL ? 'right-3' : 'left-3'}`} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            placeholder={t.confirmPassword}
                                            required
                                            autoComplete="new-password"
                                            style={fontStyle}
                                            className={`${inputBase} ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
                                        />
                                    </div>
                                )}

                                {/* Error */}
                                {error && (
                                    <p className="text-red-500 text-xs leading-snug" style={fontStyle}>
                                        {error}
                                    </p>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={fontStyle}
                                    className="w-full mt-1 bg-[#1A1A1A] text-[#F8F3EE] rounded-lg py-3 text-sm tracking-widest uppercase hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
                                >
                                    {loading ? '...' : tab === 'signin' ? t.signIn : t.signUp}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
