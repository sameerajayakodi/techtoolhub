'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import headerNavLinks from '@/data/headerNavLinks'

// Not every link fits inline on narrower desktops; the logo and footer cover the rest. About and Contact appear from xl, Home from 2xl and Privacy Policy from 1700px
const xlOnly = new Set(['/about', '/contact'])
const xxlOnly = new Set(['/'])
const hugeOnly = new Set(['/privacy-policy'])

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
            className={`${hugeOnly.has(link.href) ? 'hidden min-[1700px]:inline-flex' : xxlOnly.has(link.href) ? 'hidden 2xl:inline-flex' : xlOnly.has(link.href) ? 'hidden xl:inline-flex' : 'inline-flex'} rounded-lg px-2.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
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
