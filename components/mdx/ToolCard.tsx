import { ReactNode } from 'react'
import { requireTool } from '@/lib/affiliates'
import AffiliateButton from './AffiliateButton'

interface ToolCardProps {
  /** Tool slug from lib/affiliates.ts */
  tool: string
  /** Overrides the one-line summary from lib/affiliates.ts */
  summary?: string
  /** Overrides the price line from lib/affiliates.ts */
  pricing?: string
  /** Button text, defaults to "Try <name>" */
  cta?: string
  /** Optional label such as "Best for teams" */
  badge?: string
  /** Optional extra sentence or two under the summary */
  children?: ReactNode
}

/**
 * Compact tool box: name, one-line summary, "from" price and an affiliate button.
 * MDX: <ToolCard tool="notion" badge="Best all-rounder" />
 */
export default function ToolCard({ tool, summary, pricing, cta, badge, children }: ToolCardProps) {
  const info = requireTool(tool)
  const price = pricing ?? info.pricingFrom
  return (
    <section className="not-prose my-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center dark:border-gray-800 dark:bg-gray-900/60">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
            {info.name}
          </h3>
          {badge && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-[15px] leading-6 text-gray-700 dark:text-gray-300">
          {summary ?? info.summary}
        </p>
        {children && (
          <div className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{children}</div>
        )}
        {price && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-gray-200">Pricing:</span> {price}
          </p>
        )}
      </div>
      <div className="shrink-0">
        <AffiliateButton tool={tool} placement="tool-card">
          {cta}
        </AffiliateButton>
      </div>
    </section>
  )
}
