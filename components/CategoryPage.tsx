import PageHero from '@/components/PageHero'
import PostExplorer from '@/components/PostExplorer'
import Link from '@/components/Link'
import { getCategory, type CategorySlug } from '@/data/categories'
import { getCards } from '@/lib/posts'
import { breadcrumbJsonLd, toJsonLd } from '@/lib/structured-data'

const PAGE_SIZE = 12

/** Shared body of /ai-tools, /developer-tools and /productivity */
export default function CategoryPage({ slug }: { slug: CategorySlug }) {
  const category = getCategory(slug)
  const posts = getCards((p) => p.category === slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd({
            '@context': 'https://schema.org',
            ...breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: category.title, path: `/${slug}` },
            ]),
          }),
        }}
      />
      <PageHero
        eyebrow="Category"
        title={category.title}
        description={category.description}
        breadcrumb={[
          { name: 'Home', href: '/' },
          { name: category.title, href: `/${slug}` },
        ]}
      />
      <PostExplorer posts={posts} showCategoryFilter={false} pageSize={PAGE_SIZE} />
      {/* The grid shows PAGE_SIZE cards before "Load more"; this list keeps every article one
          crawlable link away from its category page */}
      {posts.length > PAGE_SIZE && (
        <section className="mt-16 border-t border-gray-200 pt-10 dark:border-gray-800">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
            All {category.title} articles
          </h2>
          <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {posts.map((p) => (
              <li key={p.path}>
                <Link
                  href={`/${p.path}`}
                  className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-700 dark:text-gray-300"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
