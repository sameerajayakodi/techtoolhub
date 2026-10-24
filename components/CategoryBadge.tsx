import Link from 'next/link'
import { articleTypes, getCategory, type ArticleType } from '@/data/categories'

export function CategoryBadge({ category, link = true }: { category: string; link?: boolean }) {
  const c = getCategory(category)
  const cls = `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.accent}`
  return link ? (
    <Link href={`/${c.slug}`} className={`${cls} hover:opacity-80`}>
      {c.title}
    </Link>
  ) : (
    <span className={cls}>{c.title}</span>
  )
}

export function TypeBadge({ type }: { type?: string }) {
  if (!type || !(type in articleTypes)) return null
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
      {articleTypes[type as ArticleType]}
    </span>
  )
}
