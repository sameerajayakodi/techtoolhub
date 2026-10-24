'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import headerNavLinks from '@/data/headerNavLinks'

// "Home" and "Privacy Policy" only fit inline on wide screens; the logo and footer cover them below that
const wideOnly = new Set(['/', '/privacy-policy'])

export const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
      {headerNavLinks.map((link) => {
        const active = isActive(pathname, link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`${wideOnly.has(link.href) ? 'hidden xl:inline-flex' : 'inline-flex'} rounded-lg px-2.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
              active
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/70 dark:hover:text-white'
            }`}
          >
            {link.title}
          </Link>
        )
      })}
    </nav>
  )
}
