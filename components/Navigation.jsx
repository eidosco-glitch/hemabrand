'use client'

import { useState, useEffect } from 'react'
import { Menu, Search, User, ShoppingBag, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import SearchOverlay from './SearchOverlay'
import AuthOverlay from './AuthOverlay'
import WishlistOverlay from './WishlistOverlay'
import SettingsOverlay from './SettingsOverlay'
import { useAuth } from '@/context/AuthContext'

// Simple translations object
const translations = {
  ar: {
    home: 'الرئيسية',
    shop: 'المتجر',
    contact: 'اتصل بنا',
    newArrivals: '    المجموعة الجديدة',
    shirts: 'القمصان',
    trousers: 'السراويل',
    outerwear: 'السترات',
  },
  en: {
    home: 'Home',
    shop: 'Shop',
    contact: 'Contact',
    newArrivals: 'New Arrivals',
    shirts: 'Shirts',
    trousers: 'Trousers',
    outerwear: 'Outerwear',
  }
}

export default function Navigation({ locale, hideOnScroll = true, isDark = true }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false)
  const [isShopMobileOpen, setIsShopMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { user, logout } = useAuth() || {}

  // Lock scroll when menu is open (target both html and body for iOS Safari compatibility)
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isMenuOpen])

  const t = translations[locale] || translations.ar
  const isRTL = locale === 'ar'
  const textColor = isDark ? 'text-white' : 'text-black'
  const iconColor = isDark ? 'text-white' : 'text-black'

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 50)

      if (hideOnScroll) {
        // Hide navbar when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
        setLastScrollY(currentScrollY)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, hideOnScroll])

  const shopSubItems = [
    { key: 'newArrivals', href: `/${locale}/new-arrivals` },
    { key: 'shirts', href: `/${locale}/shirts` },
    { key: 'trousers', href: `/${locale}/trousers` },
    { key: 'outerwear', href: `/${locale}/outerwear` },
  ]

  const mainMenuItems = [
    { key: 'home', href: `/${locale}` },
    { key: 'shop', hasDropdown: true },
    { key: 'contact', href: `/${locale}/contact` },
  ]

  const otherLocale = locale === 'ar' ? 'en' : 'ar'

  return (
    <>
      <header
        className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${hideOnScroll && !isVisible ? '-translate-y-full' : 'translate-y-0'}`}
        style={isScrolled ? {
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        } : {
          background: 'transparent',
        }}
      >
        <div className="max-w-360 mx-auto px-3 sm:px-6 lg:px-12 h-14 lg:h-24 flex items-center justify-between">

          {/* Left: hamburger (mobile) + nav items (desktop) */}
          <div className="flex items-center gap-1 lg:gap-8">
            {/* Mobile hamburger + search */}
            <div className="flex items-center gap-1 lg:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className={`p-1.5 sm:p-2 hover:bg-black/5 rounded-full transition-colors ${iconColor}`}
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-1.5 sm:p-2 hover:bg-black/5 rounded-full transition-colors ${iconColor}`}>
                <Search size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8 relative">
              {mainMenuItems.map((item) => (
                <div key={item.key} className="relative">
                  {item.hasDropdown ? (
                    <>
                      <button
                        onMouseEnter={() => setIsShopDropdownOpen(true)}
                        onMouseLeave={() => setIsShopDropdownOpen(false)}
                        className={`text-sm hover:text-[#A67B5B] transition-colors ${textColor}`}
                      >
                        {t[item.key]}
                      </button>
                      {isShopDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-2 bg-white rounded shadow-lg py-2 min-w-37.5 z-40"
                          onMouseEnter={() => setIsShopDropdownOpen(true)}
                          onMouseLeave={() => setIsShopDropdownOpen(false)}
                        >
                          {shopSubItems.map((subItem) => (
                            <Link
                              key={subItem.key}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-black hover:text-[#A67B5B] hover:bg-gray-50 transition-colors"
                            >
                              {t[subItem.key]}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`text-sm hover:text-[#A67B5B] transition-colors ${textColor}`}
                    >
                      {t[item.key]}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Center: Logo */}
          <Link href={`/${locale}`} className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-xl sm:text-3xl" style={{ fontFamily: 'Maharlika', fontWeight: '250', letterSpacing: '0.05em', color: isDark ? 'white' : 'black' }}>HEMA</h1>
          </Link>

          {/* Right Icons - Always on Right */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-1.5 sm:p-2 hover:bg-black/5 rounded-full transition-colors hidden lg:flex ${iconColor}`}>
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* User icon — shows avatar when signed in */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(v => !v)}
                    className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-xs font-semibold bg-[#A67B5B] text-white hover:opacity-90 transition-opacity`}
                    aria-label="Account menu"
                  >
                    {user.photoURL ? (
                      <Image src={user.photoURL} alt={user.displayName || 'avatar'} width={32} height={32} className="w-full h-full object-cover" referrerPolicy="no-referrer" unoptimized />
                    ) : (
                      <span>{(user.displayName || user.email || 'U')[0].toUpperCase()}</span>
                    )}
                  </button>
                  {isUserMenuOpen && (
                    <>
                      {/* Click-outside catcher */}
                      <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                      <div
                        className={`absolute top-10 ${isRTL ? 'left-0' : 'right-0'} bg-white border border-[#E8DDD5] rounded-xl shadow-lg py-1 min-w-44 z-50`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        <p className="px-4 py-2 text-[11px] text-[#999] truncate" style={{ fontFamily: isRTL ? 'var(--font-cairo)' : 'var(--font-inter)' }}>
                          {user.displayName || user.email}
                        </p>
                        <hr className="border-[#E8DDD5]" />
                        <button
                          onClick={() => { setIsUserMenuOpen(false); setIsWishlistOpen(true) }}
                          className="w-full text-start px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F8F3EE] transition-colors"
                          style={{ fontFamily: isRTL ? 'var(--font-cairo)' : 'var(--font-inter)' }}
                        >
                          {locale === 'ar' ? '❤ المفضلة' : '❤ Wishlist'}
                        </button>
                        <button
                          onClick={() => { setIsUserMenuOpen(false); setIsSettingsOpen(true) }}
                          className="w-full text-start px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F8F3EE] transition-colors"
                          style={{ fontFamily: isRTL ? 'var(--font-cairo)' : 'var(--font-inter)' }}
                        >
                          {locale === 'ar' ? '⚙ الإعدادات' : '⚙ Settings'}
                        </button>
                        <hr className="border-[#E8DDD5]" />
                        <button
                          onClick={() => { logout(); setIsUserMenuOpen(false) }}
                          className="w-full text-start px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F8F3EE] transition-colors"
                          style={{ fontFamily: isRTL ? 'var(--font-cairo)' : 'var(--font-inter)' }}
                        >
                          {locale === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className={`p-1.5 sm:p-2 hover:bg-black/5 rounded-full transition-colors ${iconColor}`}
                  aria-label="Sign in"
                >
                  <User size={20} strokeWidth={1.5} />
                </button>
              )}
            </div>

            <button className={`p-1.5 sm:p-2 hover:bg-black/5 rounded-full transition-colors relative ${iconColor}`}>
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#A67B5B] rounded-full" />
            </button>

            {/* Language Icon - Desktop Only */}
            <button
              onClick={() => {
                window.location.href = `/${otherLocale}`
              }}
              className={`p-1.5 sm:p-2 hover:bg-black/5 rounded-full transition-colors hidden lg:flex text-[11px] font-medium tracking-widest ${iconColor}`}
              title={locale === 'ar' ? 'English' : 'العربية'}
            >
              {locale === 'ar' ? 'EN' : 'AR'}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: isRTL ? '100%' : '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? '100%' : '-100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-60 overflow-hidden"
            style={{ backgroundColor: '#F8F3EE' }}
          >
            {/* Mobile Menu Header */}
            <div className="relative max-w-360 mx-auto px-3 sm:px-6 lg:px-12 h-14 flex items-center justify-between border-b border-[#E8DDD5]">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 sm:p-2 hover:bg-black/5 rounded-full transition-colors text-[#1A1A1A]"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
              {/* HEMA always centered */}
              <span className="absolute left-1/2 -translate-x-1/2" style={{ fontFamily: 'Maharlika', fontWeight: '250', letterSpacing: '0.05em', fontSize: '1.4rem', color: '#1A1A1A' }}>HEMA</span>
              <button
                onClick={() => { window.location.href = `/${otherLocale}` }}
                className="text-[11px] font-medium tracking-widest text-[#1A1A1A] hover:text-[#A67B5B] transition-colors"
              >
                {locale === 'ar' ? 'EN' : 'AR'}
              </button>
            </div>

            <div className="flex flex-col h-[calc(100vh-56px)]" dir={isRTL ? 'rtl' : 'ltr'}>
              {/* Nav items */}
              <nav className="flex flex-col pt-10 sm:pt-14 gap-3 sm:gap-5 px-8">
                {mainMenuItems.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 + 0.15 }}
                  >
                    {item.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => setIsShopMobileOpen(!isShopMobileOpen)}
                          className="flex items-center gap-2 text-2xl sm:text-3xl font-light text-[#1A1A1A] hover:text-[#A67B5B] transition-colors"
                        >
                          {t[item.key]}
                          <span className="text-base leading-none text-[#A67B5B]">{isShopMobileOpen ? '−' : '+'}</span>
                        </button>
                        <AnimatePresence>
                          {isShopMobileOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden flex flex-col gap-2.5 mt-3"
                            >
                              {shopSubItems.map((subItem) => (
                                <Link
                                  key={subItem.key}
                                  href={subItem.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="text-xs uppercase tracking-[0.2em] text-[#666] hover:text-[#A67B5B] transition-colors"
                                >
                                  {t[subItem.key]}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-2xl sm:text-3xl font-light text-[#1A1A1A] hover:text-[#A67B5B] transition-colors"
                      >
                        {t[item.key]}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Tagline — centered in remaining space */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex-1 flex items-center justify-center px-8"
              >
                {/* Slogan frame with ornate corner brackets */}
                <div className="relative px-14 py-10">

                  {/* Top-Left corner */}
                  <div className="absolute top-0 left-0 pointer-events-none">
                    <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 46 V4 H46" stroke="#A67B5B" strokeWidth="0.75" strokeOpacity="0.5" />
                      <line x1="46" y1="1.5" x2="46" y2="6.5" stroke="#A67B5B" strokeWidth="0.75" strokeOpacity="0.5" />
                      <line x1="1.5" y1="46" x2="6.5" y2="46" stroke="#A67B5B" strokeWidth="0.75" strokeOpacity="0.5" />
                      <path d="M10 30 V10 H30" stroke="#A67B5B" strokeWidth="0.5" strokeOpacity="0.3" />
                      <rect x="1.5" y="1.5" width="5" height="5" transform="rotate(45 4 4)" stroke="#A67B5B" strokeWidth="0.65" strokeOpacity="0.55" fill="none" />
                      <circle cx="4" cy="4" r="1" fill="#A67B5B" fillOpacity="0.5" />
                    </svg>
                  </div>

                  {/* Top-Right corner */}
                  <div className="absolute top-0 right-0 pointer-events-none">
                    <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M50 46 V4 H8" stroke="#A67B5B" strokeWidth="0.75" strokeOpacity="0.5" />
                      <line x1="8" y1="1.5" x2="8" y2="6.5" stroke="#A67B5B" strokeWidth="0.75" strokeOpacity="0.5" />
                      <line x1="47.5" y1="46" x2="52.5" y2="46" stroke="#A67B5B" strokeWidth="0.75" strokeOpacity="0.5" />
                      <path d="M44 30 V10 H24" stroke="#A67B5B" strokeWidth="0.5" strokeOpacity="0.3" />
                      <rect x="47.5" y="1.5" width="5" height="5" transform="rotate(45 50 4)" stroke="#A67B5B" strokeWidth="0.65" strokeOpacity="0.55" fill="none" />
                      <circle cx="50" cy="4" r="1" fill="#A67B5B" fillOpacity="0.5" />
                    </svg>
                  </div>

                  {/* Bottom-Left corner */}
                  <div className="absolute bottom-0 left-0 pointer-events-none">
                    <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 8 V50 H46" stroke="#A67B5B" strokeWidth="0.75" strokeOpacity="0.5" />
                      <line x1="46" y1="47.5" x2="46" y2="52.5" stroke="#A67B5B" strokeWidth="0.75" strokeOpacity="0.5" />
                      <line x1="1.5" y1="8" x2="6.5" y2="8" stroke="#A67B5B" strokeWidth="0.75" strokeOpacity="0.5" />
                      <path d="M10 24 V44 H30" stroke="#A67B5B" strokeWidth="0.5" strokeOpacity="0.3" />
                      <rect x="1.5" y="47.5" width="5" height="5" transform="rotate(45 4 50)" stroke="#A67B5B" strokeWidth="0.65" strokeOpacity="0.55" fill="none" />
                      <circle cx="4" cy="50" r="1" fill="#A67B5B" fillOpacity="0.5" />
                    </svg>
                  </div>

                  {/* Bottom-Right corner */}
                  <div className="absolute bottom-0 right-0 pointer-events-none">
                    <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M50 8 V50 H8" stroke="#A67B5B" strokeWidth="0.75" strokeOpacity="0.5" />
                      <line x1="8" y1="47.5" x2="8" y2="52.5" stroke="#A67B5B" strokeWidth="0.75" strokeOpacity="0.5" />
                      <line x1="47.5" y1="8" x2="52.5" y2="8" stroke="#A67B5B" strokeWidth="0.75" strokeOpacity="0.5" />
                      <path d="M44 24 V44 H24" stroke="#A67B5B" strokeWidth="0.5" strokeOpacity="0.3" />
                      <rect x="47.5" y="47.5" width="5" height="5" transform="rotate(45 50 50)" stroke="#A67B5B" strokeWidth="0.65" strokeOpacity="0.55" fill="none" />
                      <circle cx="50" cy="50" r="1" fill="#A67B5B" fillOpacity="0.5" />
                    </svg>
                  </div>

                  <p
                    className="text-center text-lg sm:text-xl text-[#A67B5B]/80 leading-relaxed max-w-65"
                    style={{ fontFamily: isRTL ? 'var(--font-amiri)' : 'Maharlika' }}
                  >
                    {isRTL ? '"الهمة عندها ناسها.. و أنت واحد منهم.."' : '"HEMA has its people… and you are one of them."'}
                  </p>
                </div>
              </motion.div>

              {/* Social links — pinned to bottom */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-6 px-8 pb-10"
                dir="ltr"
              >
                <a href="https://www.instagram.com/wearhema" target="_blank" rel="noopener noreferrer" className="text-[#1A1A1A] hover:text-[#A67B5B] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@hema.wear" target="_blank" rel="noopener noreferrer" className="text-[#1A1A1A] hover:text-[#A67B5B] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                  </svg>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61586453519183" target="_blank" rel="noopener noreferrer" className="text-[#1A1A1A] hover:text-[#A67B5B] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay
        locale={locale}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <AuthOverlay
        locale={locale}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <WishlistOverlay
        locale={locale}
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />

      <SettingsOverlay
        locale={locale}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  )
}