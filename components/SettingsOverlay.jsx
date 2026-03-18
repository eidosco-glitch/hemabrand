'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Lock, Trash2, Eye, EyeOff, Check } from 'lucide-react'
import Image from 'next/image'
import {
    updateProfile,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    deleteUser,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'

const ui = {
    ar: {
        title: 'الإعدادات',
        profile: 'الملف الشخصي',
        security: 'الأمان',
        displayName: 'الاسم الكامل',
        saveChanges: 'حفظ التغييرات',
        currentPassword: 'كلمة المرور الحالية',
        newPassword: 'كلمة المرور الجديدة',
        confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
        changePassword: 'تغيير كلمة المرور',
        dangerZone: 'منطقة الخطر',
        deleteAccount: 'حذف الحساب',
        deleteConfirm: 'يرجى إدخال كلمة المرور لتأكيد حذف الحساب. هذا الإجراء لا يمكن التراجع عنه.',
        deleteBtn: 'حذف حسابي نهائياً',
        passwordMismatch: 'كلمات المرور غير متطابقة',
        googleAccount: 'حسابك مرتبط بـ Google، لا يمكن تغيير كلمة المرور هنا.',
    },
    en: {
        title: 'Settings',
        profile: 'Profile',
        security: 'Security',
        displayName: 'Full Name',
        saveChanges: 'Save Changes',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmNewPassword: 'Confirm New Password',
        changePassword: 'Change Password',
        dangerZone: 'Danger Zone',
        deleteAccount: 'Delete Account',
        deleteConfirm: 'Enter your password to confirm. This action cannot be undone.',
        deleteBtn: 'Permanently Delete My Account',
        passwordMismatch: "Passwords don't match",
        googleAccount: 'Your account is linked to Google — password cannot be changed here.',
    },
    fr: {
        title: 'Paramètres',
        profile: 'Profil',
        security: 'Sécurité',
        displayName: 'Nom Complet',
        saveChanges: 'Enregistrer les modifications',
        currentPassword: 'Mot de passe actuel',
        newPassword: 'Nouveau mot de passe',
        confirmNewPassword: 'Confirmer le nouveau mot de passe',
        changePassword: 'Changer le mot de passe',
        dangerZone: 'Zone de Danger',
        deleteAccount: 'Supprimer le compte',
        deleteConfirm: 'Entrez votre mot de passe pour confirmer. Cette action est irréversible.',
        deleteBtn: 'Supprimer mon compte définitivement',
        passwordMismatch: 'Les mots de passe ne correspondent pas',
        googleAccount: 'Votre compte est lié à Google — le mot de passe ne peut pas être changé ici.',
    },
}

function friendlyError(code) {
    const map = {
        'auth/wrong-password': 'Incorrect current password.',
        'auth/weak-password': 'New password must be at least 6 characters.',
        'auth/requires-recent-login': 'Please sign out and sign back in, then try again.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
    }
    return map[code] || 'Something went wrong. Please try again.'
}

export default function SettingsOverlay({ locale, isOpen, onClose }) {
    const { user, logout } = useAuth() || {}
    const [tab, setTab] = useState('profile')

    // Profile
    const [displayName, setDisplayName] = useState('')
    const [nameSuccess, setNameSuccess] = useState(false)
    const [nameLoading, setNameLoading] = useState(false)
    const [nameError, setNameError] = useState('')

    // Password
    const [currentPw, setCurrentPw] = useState('')
    const [newPw, setNewPw] = useState('')
    const [confirmPw, setConfirmPw] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [pwSuccess, setPwSuccess] = useState(false)
    const [pwLoading, setPwLoading] = useState(false)
    const [pwError, setPwError] = useState('')

    // Delete
    const [deletePw, setDeletePw] = useState('')
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteError, setDeleteError] = useState('')
    const [confirmDelete, setConfirmDelete] = useState(false)

    const isRTL = locale === 'ar'
    const t = ui[locale] || ui.en
    const isEmailUser = user?.providerData?.some(p => p.providerId === 'password')
    const fontStyle = { fontFamily: isRTL ? 'var(--font-cairo)' : 'var(--font-inter)' }

    // Populate name from user
    useEffect(() => {
        if (user && isOpen) setDisplayName(user.displayName || '')
    }, [user, isOpen])

    const handleClose = useCallback(() => {
        setTab('profile')
        setNameError(''); setNameSuccess(false)
        setPwError(''); setPwSuccess(false); setCurrentPw(''); setNewPw(''); setConfirmPw('')
        setDeleteError(''); setDeletePw(''); setConfirmDelete(false)
        onClose()
    }, [onClose])

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') handleClose() }
        if (isOpen) window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [isOpen, handleClose])

    const handleSaveName = async (e) => {
        e.preventDefault()
        if (!displayName.trim()) return
        setNameLoading(true); setNameError(''); setNameSuccess(false)
        try {
            await updateProfile(auth.currentUser, { displayName: displayName.trim() })
            setNameSuccess(true)
            setTimeout(() => setNameSuccess(false), 2500)
        } catch (err) {
            setNameError(friendlyError(err.code))
        } finally {
            setNameLoading(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (newPw !== confirmPw) { setPwError(t.passwordMismatch); return }
        setPwLoading(true); setPwError(''); setPwSuccess(false)
        try {
            const cred = EmailAuthProvider.credential(user.email, currentPw)
            await reauthenticateWithCredential(auth.currentUser, cred)
            await updatePassword(auth.currentUser, newPw)
            setPwSuccess(true)
            setCurrentPw(''); setNewPw(''); setConfirmPw('')
            setTimeout(() => setPwSuccess(false), 2500)
        } catch (err) {
            setPwError(friendlyError(err.code))
        } finally {
            setPwLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        setDeleteLoading(true); setDeleteError('')
        try {
            if (isEmailUser) {
                const cred = EmailAuthProvider.credential(user.email, deletePw)
                await reauthenticateWithCredential(auth.currentUser, cred)
            }
            await deleteUser(auth.currentUser)
            handleClose()
        } catch (err) {
            setDeleteError(friendlyError(err.code))
        } finally {
            setDeleteLoading(false)
        }
    }

    const inputBase = 'w-full border border-[#E8DDD5] rounded-lg py-3 px-3 text-sm text-[#1A1A1A] placeholder:text-[#999] bg-white outline-none focus:border-[#A67B5B] transition-colors'

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-70 bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-0 left-0 right-0 z-80 bg-[#F8F3EE] shadow-2xl"
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        {/* Tab Header */}
                        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between h-16 border-b border-[#E8DDD5]">
                            <div className="flex gap-5">
                                {['profile', 'security'].map(key => (
                                    <button
                                        key={key}
                                        onClick={() => setTab(key)}
                                        style={fontStyle}
                                        className={`text-sm tracking-widest uppercase pb-0.5 transition-colors ${tab === key ? 'text-[#1A1A1A] border-b border-[#1A1A1A]' : 'text-[#999] hover:text-[#1A1A1A]'}`}
                                    >
                                        {key === 'profile' ? t.profile : t.security}
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleClose} className="p-1.5 hover:bg-black/5 rounded-full transition-colors text-[#1A1A1A]" aria-label="Close">
                                <X size={20} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="max-w-sm mx-auto px-4 py-8 max-h-[75vh] overflow-y-auto">

                            {/* ── PROFILE TAB ── */}
                            {tab === 'profile' && (
                                <form onSubmit={handleSaveName} className="flex flex-col gap-4">
                                    {/* Avatar initial */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 rounded-full bg-[#A67B5B] flex items-center justify-center text-white text-lg font-semibold shrink-0">
                                            {user?.photoURL
                                                ? <Image src={user.photoURL} alt="" width={48} height={48} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" unoptimized />
                                                : (user?.displayName || user?.email || 'U')[0].toUpperCase()
                                            }
                                        </div>
                                        <div>
                                            <p className="text-sm text-[#1A1A1A] font-medium" style={fontStyle}>{user?.displayName || '—'}</p>
                                            <p className="text-xs text-[#999]">{user?.email}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-[#666] mb-1 block" style={fontStyle}>{t.displayName}</label>
                                        <div className="relative">
                                            <User size={15} className={`absolute top-1/2 -translate-y-1/2 text-[#bbb] pointer-events-none ${isRTL ? 'right-3' : 'left-3'}`} />
                                            <input
                                                type="text"
                                                value={displayName}
                                                onChange={e => setDisplayName(e.target.value)}
                                                placeholder={t.displayName}
                                                style={fontStyle}
                                                className={`${inputBase} ${isRTL ? 'pr-9' : 'pl-9'}`}
                                            />
                                        </div>
                                    </div>

                                    {nameError && <p className="text-red-500 text-xs" style={fontStyle}>{nameError}</p>}
                                    {nameSuccess && (
                                        <p className="text-green-600 text-xs flex items-center gap-1" style={fontStyle}>
                                            <Check size={13} /> {locale === 'ar' ? 'تم الحفظ بنجاح' : 'Saved successfully'}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={nameLoading || !displayName.trim()}
                                        style={fontStyle}
                                        className="w-full bg-[#1A1A1A] text-[#F8F3EE] rounded-lg py-3 text-sm tracking-widest uppercase hover:bg-[#2a2a2a] transition-colors disabled:opacity-40"
                                    >
                                        {nameLoading ? '...' : t.saveChanges}
                                    </button>
                                </form>
                            )}

                            {/* ── SECURITY TAB ── */}
                            {tab === 'security' && (
                                <div className="flex flex-col gap-6">

                                    {/* Change Password */}
                                    <div>
                                        <h3 className="text-xs tracking-widest uppercase text-[#1A1A1A] mb-3" style={fontStyle}>
                                            {t.changePassword}
                                        </h3>

                                        {!isEmailUser ? (
                                            <p className="text-xs text-[#999] leading-relaxed" style={fontStyle}>{t.googleAccount}</p>
                                        ) : (
                                            <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
                                                {[
                                                    { label: t.currentPassword, val: currentPw, set: setCurrentPw, ac: 'current-password' },
                                                    { label: t.newPassword, val: newPw, set: setNewPw, ac: 'new-password' },
                                                    { label: t.confirmNewPassword, val: confirmPw, set: setConfirmPw, ac: 'new-password' },
                                                ].map(({ label, val, set, ac }) => (
                                                    <div key={label} className="relative">
                                                        <Lock size={15} className={`absolute top-1/2 -translate-y-1/2 text-[#bbb] pointer-events-none ${isRTL ? 'right-3' : 'left-3'}`} />
                                                        <input
                                                            type={showPw ? 'text' : 'password'}
                                                            value={val}
                                                            onChange={e => set(e.target.value)}
                                                            placeholder={label}
                                                            required
                                                            autoComplete={ac}
                                                            style={fontStyle}
                                                            className={`${inputBase} ${isRTL ? 'pr-9 pl-9' : 'pl-9 pr-9'}`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPw(v => !v)}
                                                            className={`absolute top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#1A1A1A] transition-colors ${isRTL ? 'left-3' : 'right-3'}`}
                                                        >
                                                            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                                                        </button>
                                                    </div>
                                                ))}

                                                {pwError && <p className="text-red-500 text-xs" style={fontStyle}>{pwError}</p>}
                                                {pwSuccess && (
                                                    <p className="text-green-600 text-xs flex items-center gap-1" style={fontStyle}>
                                                        <Check size={13} /> {locale === 'ar' ? 'تم تغيير كلمة المرور' : 'Password changed successfully'}
                                                    </p>
                                                )}
                                                <button
                                                    type="submit"
                                                    disabled={pwLoading}
                                                    style={fontStyle}
                                                    className="w-full bg-[#1A1A1A] text-[#F8F3EE] rounded-lg py-3 text-sm tracking-widest uppercase hover:bg-[#2a2a2a] transition-colors disabled:opacity-40"
                                                >
                                                    {pwLoading ? '...' : t.changePassword}
                                                </button>
                                            </form>
                                        )}
                                    </div>

                                    {/* Danger Zone */}
                                    <div className="border-t border-[#E8DDD5] pt-5">
                                        <h3 className="text-xs tracking-widest uppercase text-red-500 mb-3" style={fontStyle}>{t.dangerZone}</h3>

                                        {!confirmDelete ? (
                                            <button
                                                onClick={() => setConfirmDelete(true)}
                                                style={fontStyle}
                                                className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 rounded-lg py-2.5 text-sm hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 size={15} />
                                                {t.deleteAccount}
                                            </button>
                                        ) : (
                                            <div className="flex flex-col gap-3">
                                                <p className="text-xs text-[#666] leading-relaxed" style={fontStyle}>{t.deleteConfirm}</p>
                                                {isEmailUser && (
                                                    <input
                                                        type="password"
                                                        value={deletePw}
                                                        onChange={e => setDeletePw(e.target.value)}
                                                        placeholder={t.currentPassword}
                                                        style={fontStyle}
                                                        className={inputBase}
                                                    />
                                                )}
                                                {deleteError && <p className="text-red-500 text-xs" style={fontStyle}>{deleteError}</p>}
                                                <button
                                                    onClick={handleDeleteAccount}
                                                    disabled={deleteLoading || (isEmailUser && !deletePw)}
                                                    style={fontStyle}
                                                    className="w-full bg-red-500 text-white rounded-lg py-2.5 text-sm hover:bg-red-600 transition-colors disabled:opacity-40"
                                                >
                                                    {deleteLoading ? '...' : t.deleteBtn}
                                                </button>
                                                <button
                                                    onClick={() => { setConfirmDelete(false); setDeletePw(''); setDeleteError('') }}
                                                    className="text-xs text-[#999] hover:text-[#1A1A1A] transition-colors"
                                                    style={fontStyle}
                                                >
                                                    {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
