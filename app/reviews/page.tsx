import PageHero from '@/components/PageHero'
import PostExplorer from '@/components/PostExplorer'
import { genPageMetadata } from 'app/seo'
import { getCards } from '@/lib/posts'

// Everything that evaluates tools: single-product reviews, head-to-head comparisons and "best of" lists
const reviewFormats = ['review', 'comparison', 'listicle']

export const metadata = genPageMetadata({
  title: 'Software Reviews & Comparisons',
  description:
    'Every review, head-to-head comparison and best-of list we have published, with pros and cons, pricing and a clear verdict.',
  path: '/reviews',
})

export default function ReviewsPage() {
  const posts = getCards((p) => reviewFormats.includes(p.format))
  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title="Reviews & comparisons"
        description="Product reviews, head-to-head comparisons and best-of lists with pros and cons, pricing and a clear verdict."
        breadcrumb={[
          { name: 'Home', href: '/' },
          { name: 'Reviews', href: '/reviews' },
        ]}
      />
      <PostExplorer posts={posts} />
    </>
  )
}
