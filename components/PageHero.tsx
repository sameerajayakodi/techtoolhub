import { ReactNode } from 'react'
import Link from './Link'

interface PageHeroProps {
  eyebrow?: string
  title: string
  description?: string
  breadcrumb?: { name: string; href: string }[]
  children?: ReactNode
}

export default function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  children,
}: PageHeroProps) {
  return (
    <div className="relative pt-10 pb-8 sm:pt-14">
      {breadcrumb && (
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          <ol className="flex flex-wrap items-center gap-1.5">
            {breadcrumb.map((b, i) => (
              <li key={b.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i === breadcrumb.length - 1 ? (
                  <span aria-current="page" className="text-gray-700 dark:text-gray-300">
                    {b.name}
                  </span>
                ) : (
                  <Link href={b.href} className="hover:text-primary-600">
                    {b.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      {eyebrow && (
        <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold tracking-wider uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
        {title}
      </h1>
      {description && (
        <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
      {children}
    </div>
  )
}
