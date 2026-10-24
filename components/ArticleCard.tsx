import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'
import { getCategory, articleTypes } from '@/data/categories'
import type { PostCardData } from '@/lib/posts'
import { CategoryBadge } from './CategoryBadge'
import { RatingBadge } from './mdx/Rating'
import { categoryIcons, ClockIcon } from './icons'

/** Branded cover used when a post has no `images` frontmatter */
function GradientCover({ post }: { post: PostCardData }) {
  const c = getCategory(post.category)
  const Icon = categoryIcons[c.icon]
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${c.gradient}`}
    >
      <div className="bg-grid absolute inset-0 opacity-40 mix-blend-overlay" />
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
      <Icon className="relative h-14 w-14 text-white/90 drop-shadow" strokeWidth={1.4} />
      <span className="absolute bottom-3 left-3 rounded-md bg-black/20 px-2 py-0.5 text-[11px] font-semibold tracking-wider text-white uppercase backdrop-blur-sm">
        {articleTypes[post.type]}
      </span>
    </div>
  )
}

export default function ArticleCard({
  post,
  priority = false,
}: {
  post: PostCardData
  priority?: boolean
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/60 dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-gray-700 dark:hover:shadow-black/30">
      <div className="relative aspect-[16/9] overflow-hidden">
        {post.image ? (
          <Image
            src={post.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            priority={priority}
          />
        ) : (
          <GradientCover post={post} />
        )}
        {typeof post.rating === 'number' && (
          <div className="absolute top-3 right-3 rounded-full bg-white/95 shadow-sm dark:bg-gray-950/90">
            <RatingBadge rating={post.rating} showLabel={false} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <CategoryBadge category={post.category} link={false} />
        </div>
        <h3 className="font-display text-lg leading-snug font-bold text-gray-900 dark:text-white">
          <Link
            href={`/${post.path}`}
            className="group-hover:text-primary-600 dark:group-hover:text-primary-400 after:absolute after:inset-0"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
          {post.verdict || post.summary}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-gray-500 dark:text-gray-400">
          <time dateTime={post.date} suppressHydrationWarning>
            {formatDate(post.date, siteMetadata.locale)}
          </time>
          {post.readingTime && (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="h-3.5 w-3.5" /> {post.readingTime}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export function ArticleGrid({
  posts,
  className = '',
}: {
  posts: PostCardData[]
  className?: string
}) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {posts.map((post, i) => (
        <ArticleCard key={post.path} post={post} priority={i < 3} />
      ))}
    </div>
  )
}
