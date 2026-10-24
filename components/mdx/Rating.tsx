/** Rating helpers shared by cards, review headers and MDX components. Scores are out of 5. */

export function ratingLabel(score: number) {
  if (score >= 4.5) return 'Excellent'
  if (score >= 4) return 'Great'
  if (score >= 3.5) return 'Good'
  if (score >= 3) return 'Average'
  return 'Poor'
}

export function ratingTone(score: number) {
  if (score >= 4.5)
    return {
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500',
      soft: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20',
      stroke: '#10b981',
    }
  if (score >= 4)
    return {
      text: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-500',
      soft: 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/20',
      stroke: '#22c55e',
    }
  if (score >= 3.5)
    return {
      text: 'text-lime-600 dark:text-lime-400',
      bg: 'bg-lime-500',
      soft: 'bg-lime-50 text-lime-700 ring-lime-600/20 dark:bg-lime-500/10 dark:text-lime-300 dark:ring-lime-400/20',
      stroke: '#84cc16',
    }
  if (score >= 3)
    return {
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500',
      soft: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20',
      stroke: '#f59e0b',
    }
  return {
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500',
    soft: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/20',
    stroke: '#ef4444',
  }
}

const clamp = (n: number) => Math.max(0, Math.min(5, n))

/** Five stars with fractional fill, e.g. 4.3 */
export function Stars({ rating, className = 'h-4 w-4' }: { rating: number; className?: string }) {
  const pct = (clamp(rating) / 5) * 100
  const row = (cls: string) => (
    <div className={`flex ${cls}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`${className} shrink-0`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </div>
  )
  return (
    <span className="relative inline-flex" role="img" aria-label={`Rated ${rating} out of 5`}>
      {row('text-gray-300 dark:text-gray-700')}
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        {row('text-amber-400')}
      </span>
    </span>
  )
}

/**
 * Compact score pill, e.g. "4.6 ★ Excellent".
 * MDX: <RatingBadge rating={4.6} />  ·  <RatingBadge rating={4.6} size="lg" />
 */
export function RatingBadge({
  rating,
  size = 'sm',
  showLabel = true,
}: {
  rating: number
  size?: 'sm' | 'lg'
  showLabel?: boolean
}) {
  const tone = ratingTone(rating)
  return (
    <span
      className={`not-prose inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset ${tone.soft} ${
        size === 'lg' ? 'px-3.5 py-1.5 text-base' : 'px-2.5 py-0.5 text-xs'
      }`}
    >
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className={size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'}
        aria-hidden="true"
      >
        <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
      </svg>
      {rating.toFixed(1)}
      {showLabel && <span className="font-medium opacity-80">· {ratingLabel(rating)}</span>}
    </span>
  )
}

/** Circular score gauge used in the verdict box */
export function ScoreRing({ rating, size = 96 }: { rating: number; size?: number }) {
  const r = 42
  const c = 2 * Math.PI * r
  const tone = ratingTone(rating)
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="9"
          className="stroke-gray-200 dark:stroke-gray-800"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          stroke={tone.stroke}
          strokeDasharray={c}
          strokeDashoffset={c - (clamp(rating) / 5) * c}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl leading-none font-bold text-gray-900 dark:text-white">
          {rating.toFixed(1)}
        </span>
        <span className="mt-0.5 text-[10px] font-medium tracking-wider text-gray-500 uppercase">
          out of 5
        </span>
      </div>
    </div>
  )
}

/**
 * Per-criterion score bars.
 * MDX: <ScoreBreakdown scores={{ 'Ease of use': 4.5, 'Features': 4, 'Value': 3.5 }} />
 */
export function ScoreBreakdown({
  scores,
  title = 'Score breakdown',
}: {
  scores: Record<string, number>
  title?: string
}) {
  return (
    <div className="not-prose my-8 rounded-2xl border border-gray-200 p-5 sm:p-6 dark:border-gray-800">
      <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
        {title}
      </h3>
      <dl className="space-y-3.5">
        {Object.entries(scores).map(([label, score]) => {
          const tone = ratingTone(score)
          return (
            <div
              key={label}
              className="grid grid-cols-[minmax(0,9rem)_1fr_2.5rem] items-center gap-3 sm:grid-cols-[12rem_1fr_2.5rem]"
            >
              <dt className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </dt>
              <dd className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className={`h-full rounded-full ${tone.bg}`}
                  style={{ width: `${(clamp(score) / 5) * 100}%` }}
                />
              </dd>
              <dd className={`text-right text-sm font-semibold ${tone.text}`}>
                {score.toFixed(1)}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
