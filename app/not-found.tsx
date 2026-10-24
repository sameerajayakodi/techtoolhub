import Link from '@/components/Link'
import { categories } from '@/data/categories'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-24 text-center">
      <p className="font-display text-primary-600 dark:text-primary-400 text-7xl font-bold">404</p>
      <h1 className="font-display mt-4 text-3xl font-bold text-gray-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        The page you are looking for does not exist or has moved. Try one of these instead:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="bg-primary-600 hover:bg-primary-700 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to homepage
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:border-gray-400 dark:border-gray-700 dark:text-gray-200"
          >
            {c.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
