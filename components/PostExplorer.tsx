'use client'

import { useEffect, useMemo, useState } from 'react'
import { categories, articleTypes, type ArticleType } from '@/data/categories'
import type { PostCardData } from '@/lib/posts'
import ArticleCard from './ArticleCard'
import { SearchIcon, XIcon } from './icons'

interface PostExplorerProps {
  posts: PostCardData[]
  /** Hide the category chips (used on category pages) */
  showCategoryFilter?: boolean
  /** Hide the format chips (used on the Reviews page) */
  showTypeFilter?: boolean
  pageSize?: number
}

type Sort = 'newest' | 'rating'

const chip = (active: boolean) =>
  `whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
    active
      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
  }`

/**
 * Instant client-side search + category / format / tag filtering.
 * Filters are mirrored to the URL (?q=&category=&type=&tag=) so filtered views can be shared.
 */
export default function PostExplorer({
  posts,
  showCategoryFilter = true,
  showTypeFilter = true,
  pageSize = 12,
}: PostExplorerProps) {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('all')
  const [type, setType] = useState('all')
  const [tag, setTag] = useState('')
  const [sort, setSort] = useState<Sort>('newest')
  const [visible, setVisible] = useState(pageSize)

  // Read initial filters from the URL once
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    setQ(p.get('q') ?? '')
    setCategory(p.get('category') ?? 'all')
    setType(p.get('type') ?? 'all')
    setTag(p.get('tag') ?? '')
  }, [])

  // Mirror filters to the URL without adding history entries
  useEffect(() => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (category !== 'all') p.set('category', category)
    if (type !== 'all') p.set('type', type)
    if (tag) p.set('tag', tag)
    const qs = p.toString()
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
    setVisible(pageSize)
  }, [q, category, type, tag, pageSize])

  const presentTypes = useMemo(
    () =>
      (Object.keys(articleTypes) as ArticleType[]).filter((t) => posts.some((p) => p.type === t)),
    [posts]
  )

  const topTags = useMemo(() => {
    const counts: Record<string, number> = {}
    posts.forEach((p) => p.tags.forEach((t) => (counts[t] = (counts[t] ?? 0) + 1)))
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14)
      .map(([t]) => t)
  }, [posts])

  const filtered = useMemo(() => {
    const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean)
    const list = posts.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (type !== 'all' && p.type !== type) return false
      if (tag && !p.tags.includes(tag)) return false
      if (!terms.length) return true
      const haystack =
        `${p.title} ${p.summary} ${p.verdict ?? ''} ${p.tags.join(' ')}`.toLowerCase()
      return terms.every((t) => haystack.includes(t))
    })
    if (sort === 'rating') return [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    return list
  }, [posts, q, category, type, tag, sort])

  const hasFilters = q || category !== 'all' || type !== 'all' || tag
  const reset = () => {
    setQ('')
    setCategory('all')
    setType('all')
    setTag('')
  }

  return (
    <div>
      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 dark:border-gray-800 dark:bg-gray-900/60">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search articles</span>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search reviews, tools, topics…"
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-xl border-gray-300 bg-gray-50 py-2.5 pr-4 pl-11 text-sm text-gray-900 focus:bg-white dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-xl border-gray-300 bg-gray-50 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            >
              <option value="newest">Newest</option>
              <option value="rating">Top rated</option>
            </select>
          </label>
        </div>

        {showCategoryFilter && (
          <div
            className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1"
            role="group"
            aria-label="Filter by category"
          >
            <button
              type="button"
              className={chip(category === 'all')}
              onClick={() => setCategory('all')}
            >
              All categories
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                className={chip(category === c.slug)}
                onClick={() => setCategory(c.slug)}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}

        {showTypeFilter && presentTypes.length > 1 && (
          <div
            className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1"
            role="group"
            aria-label="Filter by format"
          >
            <button type="button" className={chip(type === 'all')} onClick={() => setType('all')}>
              All formats
            </button>
            {presentTypes.map((t) => (
              <button key={t} type="button" className={chip(type === t)} onClick={() => setType(t)}>
                {articleTypes[t]}
              </button>
            ))}
          </div>
        )}

        {topTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by tag">
            {topTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(tag === t ? '' : t)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  tag === t
                    ? 'bg-primary-600 text-white'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-300 dark:hover:bg-primary-500/20'
                }`}
              >
                #{t}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 mb-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <p aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={reset}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 inline-flex items-center gap-1 font-medium"
          >
            <XIcon className="h-4 w-4" /> Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center dark:border-gray-700">
          <p className="font-display text-lg font-semibold text-gray-900 dark:text-white">
            {posts.length === 0 ? 'Articles are coming soon' : 'No articles match your filters'}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {posts.length === 0
              ? 'Check back shortly, we are testing tools right now.'
              : 'Try a different keyword or clear the filters.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, visible).map((post, i) => (
            <ArticleCard key={post.path} post={post} priority={i < 3} />
          ))}
        </div>
      )}

      {filtered.length > visible && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + pageSize)}
            className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            Load more articles
          </button>
        </div>
      )}
    </div>
  )
}
