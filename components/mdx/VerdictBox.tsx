import { ReactNode } from 'react'
import { requireTool } from '@/lib/affiliates'
import AffiliateButton from './AffiliateButton'
import { TrophyIcon } from '../icons'

interface Pick {
  /** Who this pick is for, e.g. "Solo developers on a budget" */
  who: string
  /** The recommendation, e.g. "GitHub Copilot Pro" */
  pick: string
  /** Optional tool slug from lib/affiliates.ts, adds a "Try" button */
  tool?: string
  /** Optional short reason */
  why?: string
}

interface VerdictBoxProps {
  title?: string
  picks: Pick[]
  /** Optional one- or two-sentence bottom line above the picks */
  children?: ReactNode
}

/**
 * "Who should pick what" summary for the top of buyer-intent articles. It has no score, so it
 * suits comparisons and best-of lists. Keep ads below it, never above.
 *
 * MDX:
 * <VerdictBox picks={[
 *   { who: 'Most people', pick: 'ChatGPT Plus', tool: 'chatgpt', why: 'Best all-rounder' },
 *   { who: 'Privacy-first users in the EU', pick: 'Mistral Vibe', tool: 'mistral' },
 * ]}>
 *   Short bottom line.
 * </VerdictBox>
 */
export default function VerdictBox({ title = 'Quick verdict', picks, children }: VerdictBoxProps) {
  picks.forEach((p) => p.tool && requireTool(p.tool))
  return (
    <section className="not-prose to-primary-50/60 dark:to-primary-950/30 my-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:from-gray-900">
      <p className="text-primary-600 dark:text-primary-400 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
        <TrophyIcon className="h-4 w-4" /> {title}
      </p>
      {children && (
        <div className="mt-2 text-[15px] leading-7 text-gray-700 dark:text-gray-300">
          {children}
        </div>
      )}
      <ul className="mt-4 divide-y divide-gray-200 dark:divide-gray-800">
        {picks.map((p) => (
          <li
            key={p.who}
            className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
          >
            <div className="min-w-0 flex-1 text-[15px] leading-6">
              <span className="text-gray-600 dark:text-gray-400">{p.who}:</span>{' '}
              <strong className="font-semibold text-gray-900 dark:text-white">{p.pick}</strong>
              {p.why && <span className="text-gray-600 dark:text-gray-400"> · {p.why}</span>}
            </div>
            {p.tool && (
              <div className="shrink-0">
                <AffiliateButton tool={p.tool} variant="secondary" placement="verdict-box" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
