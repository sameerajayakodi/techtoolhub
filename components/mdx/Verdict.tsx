import { ReactNode } from 'react'
import { ScoreRing, Stars, ratingLabel, ratingTone } from './Rating'
import CTAButton from './CTAButton'
import { TrophyIcon } from '../icons'

interface VerdictProps {
  rating: number
  title?: string
  /** Short audience line, e.g. "Solo creators and small marketing teams" */
  bestFor?: string
  /** Optional call-to-action */
  ctaText?: string
  ctaHref?: string
  children?: ReactNode
}

/**
 * Final verdict / summary box with a score gauge.
 * MDX:
 * <Verdict rating={4.5} bestFor="Small teams" ctaText="Try it free" ctaHref="https://...">
 *   One or two sentences with your bottom line.
 * </Verdict>
 */
export default function Verdict({
  rating,
  title = 'Our verdict',
  bestFor,
  ctaText,
  ctaHref,
  children,
}: VerdictProps) {
  const tone = ratingTone(rating)
  return (
    <section className="not-prose to-primary-50/60 dark:to-primary-950/30 relative my-10 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:from-gray-900">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <ScoreRing rating={rating} />
        <div className="min-w-0 flex-1">
          <p className="text-primary-600 dark:text-primary-400 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
            <TrophyIcon className="h-4 w-4" /> {title}
          </p>
          <p className={`font-display mt-1 text-2xl font-bold ${tone.text}`}>
            {ratingLabel(rating)}
          </p>
          <div className="mt-1">
            <Stars rating={rating} />
          </div>
          {children && (
            <div className="mt-3 text-[15px] leading-7 text-gray-700 dark:text-gray-300">
              {children}
            </div>
          )}
          {bestFor && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">Best for:</span>{' '}
              {bestFor}
            </p>
          )}
        </div>
      </div>
      {ctaText && ctaHref && (
        <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-800">
          <CTAButton href={ctaHref}>{ctaText}</CTAButton>
        </div>
      )}
    </section>
  )
}
