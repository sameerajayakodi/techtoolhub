import Link from '@/components/Link'
import PageHero from '@/components/PageHero'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Topics',
  description: 'Browse every topic we cover.',
  path: '/tags',
})

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <>
      <PageHero
        eyebrow="Explore"
        title="Topics"
        description="Every topic we cover, most popular first."
      />
      {sortedTags.length === 0 && <p className="text-gray-500">No topics yet.</p>}
      <div className="flex flex-wrap gap-3">
        {sortedTags.map((t) => (
          <Link
            key={t}
            href={`/tags/${slug(t)}`}
            className="hover:border-primary-300 hover:text-primary-700 dark:hover:border-primary-700 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
          >
            #{t}
            <span className="rounded-full bg-gray-100 px-2 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {tagCounts[t]}
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
