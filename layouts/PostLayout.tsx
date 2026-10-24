import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import Image from '@/components/Image'
import NextImage from 'next/image'
import Tag from '@/components/Tag'
import AdSense from '@/components/AdSense'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TableOfContents, { type TocItem } from '@/components/TableOfContents'
import { CategoryBadge, TypeBadge } from '@/components/CategoryBadge'
import { ArticleGrid } from '@/components/ArticleCard'
import { ScoreRing, Stars, ratingLabel, ratingTone } from '@/components/mdx/Rating'
import CTAButton from '@/components/mdx/CTAButton'
import { ClockIcon, InfoIcon, ShieldIcon } from '@/components/icons'
import siteMetadata from '@/data/siteMetadata'
import { getCategory } from '@/data/categories'
import { getPostImage, type PostCardData } from '@/lib/posts'
import type { Product } from '@/lib/structured-data'

const dateFmt: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
const fmt = (d: string) => new Date(d).toLocaleDateString(siteMetadata.locale, dateFmt)

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  related?: PostCardData[]
  children: ReactNode
}

function ReviewSummary({ content }: { content: CoreContent<Blog> }) {
  const rating = content.rating as number
  const product = content.product as Product | undefined
  const tone = ratingTone(rating)
  return (
    <div className="mt-8 grid gap-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 sm:grid-cols-[auto_1fr] sm:items-center dark:border-gray-800 dark:from-gray-900 dark:to-gray-950">
      <ScoreRing rating={rating} size={104} />
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`font-display text-xl font-bold ${tone.text}`}>
            {ratingLabel(rating)}
          </span>
          <Stars rating={rating} />
        </div>
        {content.verdict && (
          <p className="mt-2 text-[15px] leading-7 text-gray-700 dark:text-gray-300">
            {content.verdict}
          </p>
        )}
        {product && (
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
            {product.price !== undefined && (
              <span>
                <span className="font-semibold text-gray-900 dark:text-white">Price:</span>{' '}
                {product.price}
              </span>
            )}
            {product.platforms && (
              <span>
                <span className="font-semibold text-gray-900 dark:text-white">Platforms:</span>{' '}
                {product.platforms}
              </span>
            )}
            {product.url && (
              <CTAButton href={product.url} sponsored={content.affiliate}>
                Visit {product.name}
              </CTAButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PostLayout({
  content,
  authorDetails,
  next,
  prev,
  related = [],
  children,
}: LayoutProps) {
  const { slug, date, lastmod, title, summary, tags, category, format, readingTime, toc } = content
  const cat = getCategory(category)
  const isReview = format === 'review' && typeof content.rating === 'number'
  const tocItems = (toc ?? []) as TocItem[]
  const cover = getPostImage(content.images)

  return (
    <>
      <ScrollTopAndComment />
      <article>
        <header className="border-b border-gray-200 pt-8 pb-8 dark:border-gray-800">
          <nav aria-label="Breadcrumb" className="mb-5 text-sm text-gray-500 dark:text-gray-400">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-primary-600">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/${cat.slug}`} className="hover:text-primary-600">
                  {cat.title}
                </Link>
              </li>
              <li aria-hidden="true" className="hidden sm:block">
                /
              </li>
              <li
                aria-current="page"
                className="hidden max-w-xs truncate text-gray-700 sm:block dark:text-gray-300"
              >
                {title}
              </li>
            </ol>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={category} />
            <TypeBadge type={format} />
          </div>
          <h1 className="font-display mt-4 max-w-4xl text-3xl leading-tight font-bold tracking-tight text-gray-900 sm:text-4xl md:text-[2.75rem] dark:text-white">
            {title}
          </h1>
          {summary && (
            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-400">
              {summary}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2">
                {authorDetails.map(
                  (a) =>
                    a.avatar && (
                      <Image
                        key={a.name}
                        src={a.avatar}
                        width={36}
                        height={36}
                        alt=""
                        className="h-9 w-9 rounded-full ring-2 ring-white dark:ring-gray-950"
                      />
                    )
                )}
              </div>
              <span>
                By{' '}
                <Link
                  href="/about"
                  className="hover:text-primary-600 font-semibold text-gray-900 dark:text-white"
                >
                  {authorDetails.map((a) => a.name).join(', ')}
                </Link>
              </span>
            </div>
            <span>
              <time dateTime={date}>{fmt(date)}</time>
              {lastmod && lastmod !== date && (
                <>
                  {' · '}Updated <time dateTime={lastmod}>{fmt(lastmod)}</time>
                </>
              )}
            </span>
            {readingTime?.text && (
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="h-4 w-4" /> {readingTime.text}
              </span>
            )}
          </div>
          {isReview && <ReviewSummary content={content} />}
          {cover && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
              <NextImage
                src={cover}
                alt={title}
                fill
                priority
                sizes="(min-width: 1152px) 1088px, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </header>

        {content.affiliate && (
          <p className="mt-6 flex gap-2 rounded-xl bg-gray-50 px-4 py-3 text-xs leading-5 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
            <InfoIcon className="h-4 w-4 shrink-0" />
            <span>
              <strong className="font-semibold">Disclosure:</strong> This article contains affiliate
              links. If you buy through them we may earn a commission at no extra cost to you. It
              never affects our verdicts.{' '}
              <Link href="/affiliate-disclosure" className="underline">
                Learn more
              </Link>
              .
            </span>
          </p>
        )}

        <AdSense placement="articleTop" />

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0">
            {tocItems.length > 2 && (
              <details className="mb-8 rounded-xl border border-gray-200 p-4 lg:hidden dark:border-gray-800">
                <summary className="cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
                  On this page
                </summary>
                <ul className="mt-3 space-y-2 text-sm">
                  {tocItems
                    .filter((t) => t.depth === 2)
                    .map((t) => (
                      <li key={t.url}>
                        <a
                          href={t.url}
                          className="hover:text-primary-600 text-gray-600 dark:text-gray-400"
                        >
                          {t.value}
                        </a>
                      </li>
                    ))}
                </ul>
              </details>
            )}
            <div className="prose prose-gray dark:prose-invert prose-headings:font-display prose-img:rounded-xl max-w-none">
              {children}
            </div>

            <AdSense placement="articleBottom" />

            {tags && tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            )}

            <div className="mt-10 flex gap-4 rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
              <ShieldIcon className="text-primary-600 dark:text-primary-400 h-6 w-6 shrink-0" />
              <div className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                <p className="font-semibold text-gray-900 dark:text-white">How we test</p>
                <p>
                  We use every tool we review on real projects, compare it with its closest
                  alternatives and update articles when pricing or features change.{' '}
                  <Link
                    href="/how-we-review"
                    className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                  >
                    Read our review process
                  </Link>
                  .
                </p>
              </div>
            </div>

            {siteMetadata.comments && (
              <div className="pt-8 text-center text-gray-700 dark:text-gray-300" id="comment">
                <Comments slug={slug} />
              </div>
            )}

            {(next || prev) && (
              <nav aria-label="More articles" className="mt-10 grid gap-4 sm:grid-cols-2">
                {prev?.path ? (
                  <Link
                    href={`/${prev.path}`}
                    className="hover:border-primary-300 dark:hover:border-primary-700 rounded-2xl border border-gray-200 p-5 transition-colors dark:border-gray-800"
                  >
                    <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      ← Previous
                    </span>
                    <span className="font-display mt-1 block font-semibold text-gray-900 dark:text-white">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {next?.path && (
                  <Link
                    href={`/${next.path}`}
                    className="hover:border-primary-300 dark:hover:border-primary-700 rounded-2xl border border-gray-200 p-5 text-right transition-colors dark:border-gray-800"
                  >
                    <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Next →
                    </span>
                    <span className="font-display mt-1 block font-semibold text-gray-900 dark:text-white">
                      {next.title}
                    </span>
                  </Link>
                )}
              </nav>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <TableOfContents toc={tocItems} />
              <AdSense placement="sidebar" format="vertical" className="my-0!" />
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16 border-t border-gray-200 pt-12 dark:border-gray-800">
            <h2 className="font-display mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Related articles
            </h2>
            <ArticleGrid posts={related} />
          </section>
        )}
      </article>
    </>
  )
}
