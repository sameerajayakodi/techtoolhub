import { ReactNode } from 'react'
import { CheckIcon, MinusIcon, XIcon } from '../icons'

type Cell = string | number | boolean | null | ReactNode

interface ComparisonTableProps {
  /** Header row. The first column is the row label (e.g. "Feature" or "Tool") */
  columns: string[]
  rows: Cell[][]
  /** Index of a column to highlight as the winner / editor's pick (1-based data column, e.g. 1) */
  highlight?: number
  /** Index of a row to highlight instead (0-based, e.g. 0 = first row). Use this for "Best of" tables where each row is a tool */
  highlightRow?: number
  highlightLabel?: string
  caption?: string
}

function renderCell(value: Cell) {
  if (value === true)
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
        <CheckIcon className="h-4 w-4" strokeWidth={2.5} />
        <span className="sr-only">Yes</span>
      </span>
    )
  if (value === false)
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
        <XIcon className="h-4 w-4" strokeWidth={2.5} />
        <span className="sr-only">No</span>
      </span>
    )
  if (value === null || value === '' || value === undefined)
    return (
      <span className="text-gray-400">
        <MinusIcon className="h-4 w-4" />
        <span className="sr-only">Not applicable</span>
      </span>
    )
  return value
}

/**
 * Responsive comparison / specs table for "X vs Y" and "Best of" articles.
 * Scrolls horizontally on small screens with a sticky first column.
 * `true` / `false` / `null` cells render as ✓ / ✗ / –.
 *
 * MDX:
 * <ComparisonTable
 *   columns={['Feature', 'Tool A', 'Tool B']}
 *   rows={[
 *     ['Free plan', true, false],
 *     ['Starting price', '$10/mo', '$12/mo'],
 *   ]}
 *   highlight={1}
 * />
 * For ranked lists (one tool per row) use highlightRow={0} instead of highlight.
 */
export default function ComparisonTable({
  columns,
  rows,
  highlight,
  highlightRow,
  highlightLabel = "Editor's pick",
  caption,
}: ComparisonTableProps) {
  const isHl = (i: number) => highlight !== undefined && i === highlight

  return (
    <figure className="not-prose my-8">
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm dark:border-gray-800">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900">
              {columns.map((col, i) => (
                <th
                  key={col}
                  scope="col"
                  className={`font-display px-4 py-3.5 align-bottom font-semibold text-gray-900 dark:text-white ${
                    i === 0 ? 'sticky left-0 z-10 bg-gray-50 dark:bg-gray-900' : 'text-center'
                  } ${isHl(i) ? 'bg-primary-50! text-primary-800! dark:bg-primary-500/15! dark:text-primary-200!' : ''}`}
                >
                  {isHl(i) && (
                    <span className="text-primary-600 dark:text-primary-300 mb-1 block text-[10px] font-semibold tracking-wider uppercase">
                      {highlightLabel}
                    </span>
                  )}
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {rows.map((row, r) => (
              <tr
                key={r}
                className={
                  r === highlightRow
                    ? 'bg-primary-50 dark:bg-primary-950 font-semibold'
                    : 'bg-white transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900'
                }
              >
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th
                      key={i}
                      scope="row"
                      className="sticky left-0 z-10 bg-inherit px-4 py-3 font-medium whitespace-nowrap text-gray-700 dark:text-gray-300"
                    >
                      {cell as ReactNode}
                      {r === highlightRow && (
                        <span className="bg-primary-600 ml-2 rounded-full px-2 py-0.5 align-middle text-[10px] font-semibold tracking-wider text-white uppercase">
                          {highlightLabel}
                        </span>
                      )}
                    </th>
                  ) : (
                    <td
                      key={i}
                      className={`px-4 py-3 text-center text-gray-700 dark:text-gray-300 ${
                        isHl(i) ? 'bg-primary-50/50 dark:bg-primary-500/5 font-medium' : ''
                      }`}
                    >
                      <span className="inline-flex items-center justify-center">
                        {renderCell(cell)}
                      </span>
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
