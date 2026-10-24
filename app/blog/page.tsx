import PageHero from '@/components/PageHero'
import PostExplorer from '@/components/PostExplorer'
import { genPageMetadata } from 'app/seo'
import { getCards } from '@/lib/posts'

export const metadata = genPageMetadata({
  title: 'All Articles',
  description: 'Search and filter every review, comparison, best-of list and guide on TechToolHub.',
  path: '/blog',
})

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Explore"
        title="All articles"
        description="Search and filter every review, comparison and guide by category, format or tag."
        breadcrumb={[
          { name: 'Home', href: '/' },
          { name: 'All articles', href: '/blog' },
        ]}
      />
      <PostExplorer posts={getCards()} />
    </>
  )
}
