import { CheckIcon, XIcon } from '../icons'

interface ProsConsProps {
  pros: string[]
  cons: string[]
  prosTitle?: string
  consTitle?: string
}

/**
 * Side-by-side pros and cons boxes (stacked on mobile).
 * MDX: <ProsCons pros={['Fast', 'Free tier']} cons={['No offline mode']} />
 */
export default function ProsCons({
  pros,
  cons,
  prosTitle = 'Pros',
  consTitle = 'Cons',
}: ProsConsProps) {
  return (
    <div className="not-prose my-8 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/5">
        <h3 className="font-display mb-3 flex items-center gap-2 text-base font-bold text-emerald-800 dark:text-emerald-300">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckIcon className="h-4 w-4" strokeWidth={2.5} />
          </span>
          {prosTitle}
        </h3>
        <ul className="space-y-2.5">
          {pros.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 text-[15px] leading-6 text-gray-700 dark:text-gray-300"
            >
              <CheckIcon
                className="mt-1 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                strokeWidth={2.5}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 dark:border-rose-500/20 dark:bg-rose-500/5">
        <h3 className="font-display mb-3 flex items-center gap-2 text-base font-bold text-rose-800 dark:text-rose-300">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white">
            <XIcon className="h-4 w-4" strokeWidth={2.5} />
          </span>
          {consTitle}
        </h3>
        <ul className="space-y-2.5">
          {cons.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 text-[15px] leading-6 text-gray-700 dark:text-gray-300"
            >
              <XIcon
                className="mt-1 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400"
                strokeWidth={2.5}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
