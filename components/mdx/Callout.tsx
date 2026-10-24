import { ReactNode } from 'react'
import { BulbIcon, InfoIcon, WarningIcon, CheckIcon } from '../icons'

const styles = {
  info: {
    icon: InfoIcon,
    box: 'border-sky-200 bg-sky-50/70 dark:border-sky-500/20 dark:bg-sky-500/5',
    title: 'text-sky-800 dark:text-sky-300',
    label: 'Note',
  },
  tip: {
    icon: BulbIcon,
    box: 'border-violet-200 bg-violet-50/70 dark:border-violet-500/20 dark:bg-violet-500/5',
    title: 'text-violet-800 dark:text-violet-300',
    label: 'Pro tip',
  },
  warning: {
    icon: WarningIcon,
    box: 'border-amber-200 bg-amber-50/70 dark:border-amber-500/20 dark:bg-amber-500/5',
    title: 'text-amber-800 dark:text-amber-300',
    label: 'Heads up',
  },
  success: {
    icon: CheckIcon,
    box: 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/20 dark:bg-emerald-500/5',
    title: 'text-emerald-800 dark:text-emerald-300',
    label: 'Bottom line',
  },
}

/**
 * Highlighted note box.
 * MDX: <Callout type="tip" title="Save 20%">Pay yearly to get two months free.</Callout>
 */
export default function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: keyof typeof styles
  title?: string
  children: ReactNode
}) {
  const s = styles[type]
  const Icon = s.icon
  return (
    <div className={`not-prose my-6 flex gap-3 rounded-xl border p-4 ${s.box}`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${s.title}`} />
      <div className="min-w-0 text-[15px] leading-7 text-gray-700 dark:text-gray-300">
        <p className={`font-semibold ${s.title}`}>{title || s.label}</p>
        <div className="[&_a]:text-primary-600 [&_a]:font-medium [&_a]:underline">{children}</div>
      </div>
    </div>
  )
}
