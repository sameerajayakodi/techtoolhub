import { ReactNode } from 'react'
import { RatingBadge } from './Rating'
import CTAButton from './CTAButton'
import { CheckIcon, XIcon } from '../icons'

interface ProductCardProps {
  rank?: number
  name: string
  rating?: number
  bestFor?: string
  price?: string
  url?: string
  ctaText?: string
  pros?: string[]
  cons?: string[]
  /** Optional badge such as "Best overall" or "Best free option" */
  badge?: string
  children?: ReactNode
}

/**
 * A ranked product entry for "Top 10 / Best of" listicles.
 * Use a normal "## 1. Tool name" heading above it so it appears in the table of contents.
 *
 * MDX:
 * <ProductCard rank={1} name="Tool A" rating={4.7} badge="Best overall" bestFor="Most teams"
 *   price="Free · Pro $10/mo" url="https://..." pros={['...']} cons={['...']}>
 *   Short description of why it made the list.
 * </ProductCard>
 */
export default function ProductCard({
  rank,
  name,
  rating,
  bestFor,
  price,
  url,
  ctaText,
  pros,
  cons,
  badge,
  children,
}: ProductCardProps) {
  return (
    <section className="not-prose my-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
      <div className="flex flex-wrap items-start gap-4 border-b border-gray-100 p-5 dark:border-gray-800">
        {rank !== undefined && (
          <span className="from-primary-500 font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br to-cyan-500 text-lg font-bold text-white shadow-sm">
            {rank}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">{name}</h3>
            {badge && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
                {badge}
              </span>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
            {rating !== undefined && <RatingBadge rating={rating} />}
            {bestFor && (
              <span>
                <span className="font-medium text-gray-900 dark:text-gray-200">Best for:</span>{' '}
                {bestFor}
              </span>
            )}
            {price && (
              <span>
                <span className="font-medium text-gray-900 dark:text-gray-200">Price:</span> {price}
              </span>
            )}
          </div>
        </div>
      </div>
      {children && (
        <div className="px-5 pt-4 text-[15px] leading-7 text-gray-700 dark:text-gray-300">
          {children}
        </div>
      )}
      {Boolean(pros?.length || cons?.length) && (
        <div className="grid gap-4 px-5 pt-4 sm:grid-cols-2">
          {pros?.length ? (
            <ul className="space-y-1.5">
              {pros.map((p) => (
                <li key={p} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <CheckIcon
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                    strokeWidth={2.5}
                  />
                  {p}
                </li>
              ))}
            </ul>
          ) : null}
          {cons?.length ? (
            <ul className="space-y-1.5">
              {cons.map((c) => (
                <li key={c} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" strokeWidth={2.5} />
                  {c}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
      <div className="p-5">
        {url && <CTAButton href={url}>{ctaText || `Visit ${name}`}</CTAButton>}
      </div>
    </section>
  )
}
