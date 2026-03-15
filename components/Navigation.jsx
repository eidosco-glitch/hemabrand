'use client'

import { useState, useEffect } from 'react'
import { Menu, Search, User, ShoppingBag, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

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
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-12 h-14 lg:h-24 flex items-center justify-between">

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
              <button className={`p-1.5 sm:p-2 hover:bg-black/5 rounded-full transition-colors ${iconColor}`}>
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
                          className="absolute top-full left-0 mt-2 bg-white rounded shadow-lg py-2 min-w-[150px] z-40"
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
            <button className={`p-1.5 sm:p-2 hover:bg-black/5 rounded-full transition-colors hidden lg:flex ${iconColor}`}>
              <Search size={20} strokeWidth={1.5} />
            </button>

            <button className={`p-1.5 sm:p-2 hover:bg-black/5 rounded-full transition-colors ${iconColor}`}>
              <User size={20} strokeWidth={1.5} />
            </button>

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
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60]"
            style={{ backgroundColor: '#F8F3EE' }}
          >
            {/* Mobile Menu Header */}
            <div className="relative max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-12 h-14 flex items-center justify-between border-b border-[#E8DDD5]">
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

            <nav className={`flex flex-col justify-center h-[calc(100vh-56px)] gap-3 sm:gap-5 px-8 ${isRTL ? 'items-end' : 'items-start'}`}>
              {mainMenuItems.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 + 0.15 }}
                  className={`w-full max-w-[260px] ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setIsShopMobileOpen(!isShopMobileOpen)}
                        className={`w-full flex items-center gap-3 text-2xl sm:text-3xl font-light text-[#1A1A1A] hover:text-[#A67B5B] transition-colors ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}
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
                            className={`overflow-hidden flex flex-col gap-2.5 mt-3 ${isRTL ? 'items-end' : 'items-start'}`}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}