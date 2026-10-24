import PageHero from '@/components/PageHero'
import PostExplorer from '@/components/PostExplorer'
import { genPageMetadata } from 'app/seo'
import { getCards } from '@/lib/posts'

export const metadata = genPageMetadata({
  title: 'In-Depth Software Reviews',
  description:
    'Every hands-on review we have published, with scores, pros and cons, pricing and a clear verdict.',
  path: '/reviews',
})

export default function ReviewsPage() {
  const posts = getCards((p) => p.format === 'review')
  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title="In-depth reviews"
        description="Scored, hands-on reviews with pros and cons, pricing and a clear verdict. Sort by top rated to see our favourites."
        breadcrumb={[
          { name: 'Home', href: '/' },
          { name: 'Reviews', href: '/reviews' },
        ]}
      />
      <PostExplorer posts={posts} showTypeFilter={false} />
    </>
  )
}
