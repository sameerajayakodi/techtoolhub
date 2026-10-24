interface SpecsTableProps {
  specs: Record<string, string | number>
  title?: string
}

/**
 * Two-column key / value specs card.
 * MDX: <SpecsTable specs={{ Developer: 'Acme Inc.', Platforms: 'Web, macOS, Windows', 'Free plan': 'Yes' }} />
 */
export default function SpecsTable({ specs, title = 'Key specs' }: SpecsTableProps) {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
      <h3 className="border-b border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold tracking-wider text-gray-600 uppercase dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
        {title}
      </h3>
      <dl className="divide-y divide-gray-100 dark:divide-gray-800/80">
        {Object.entries(specs).map(([key, value]) => (
          <div key={key} className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{key}</dt>
            <dd className="text-sm font-medium text-gray-900 sm:col-span-2 dark:text-gray-100">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
