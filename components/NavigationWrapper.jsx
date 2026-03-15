'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function NavigationWrapper({ locale }) {
    const pathname = usePathname()

    // Check if we're on the home page (path ends with just the locale)
    const isHomePage = pathname === `/${locale}`

    return <Navigation locale={locale} isDark={isHomePage} />
}
