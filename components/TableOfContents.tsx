'use client'

import { useEffect, useMemo, useState } from 'react'

export interface TocItem {
  value: string
  url: string
  depth: number
}

/** Sticky "On this page" list that highlights the section currently in view */
export default function TableOfContents({ toc }: { toc: TocItem[] }) {
  const items = useMemo(() => toc.filter((t) => t.depth >= 2 && t.depth <= 3), [toc])
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const headings = items
      .map((t) => document.getElementById(decodeURIComponent(t.url.slice(1))))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!headings.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(`#${visible[0].target.id}`)
      },
      { rootMargin: '-80px 0px -70% 0px' }
    )
    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [items])

  if (items.length < 2) return null

  return (
    <nav aria-label="Table of contents">
      <p className="mb-3 text-xs font-semibold tracking-wider text-gray-900 uppercase dark:text-white">
        On this page
      </p>
      <ul className="space-y-1 border-l border-gray-200 text-sm dark:border-gray-800">
        {items.map((t) => (
          <li key={t.url}>
            <a
              href={t.url}
              className={`-ml-px block border-l-2 py-1 leading-snug transition-colors ${t.depth === 3 ? 'pl-6' : 'pl-3'} ${
                active === t.url
                  ? 'border-primary-500 text-primary-700 dark:text-primary-300 font-medium'
                  : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {t.value}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
