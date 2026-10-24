import PageHero from '@/components/PageHero'
import PostExplorer from '@/components/PostExplorer'
import { getCategory, type CategorySlug } from '@/data/categories'
import { getCards } from '@/lib/posts'
import { breadcrumbJsonLd, toJsonLd } from '@/lib/structured-data'

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
      <PostExplorer posts={posts} showCategoryFilter={false} />
    </>
  )
}
