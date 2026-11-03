import { CheckIcon } from './icons'

/** Shown only on articles with `handsOn: true` (the author's own testing and screenshots) */
export default function HandsOnBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
      title="Includes the author's own testing and screenshots"
    >
      <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
      Hands-on tested
    </span>
  )
}
