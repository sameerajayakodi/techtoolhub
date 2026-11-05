import { slug } from 'github-slugger'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { SITE_URL } from '@/lib/site'
import PageHero from '@/components/PageHero'
import { ArticleGrid } from '@/components/ArticleCard'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { getCards } from '@/lib/posts'
import { isIndexableTag } from '@/lib/tags'

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    // A tag with one article is a near-copy of that article's card: keep it out of the index
    ...(isIndexableTag(tag) ? {} : { robots: { index: false, follow: true } }),
    title: `#${tag}`,
    description: `Reviews, comparisons and guides about ${tag} on ${siteMetadata.title}, newest first.`,
    path: `/tags/${tag}`,
    alternates: {
      canonical: `/tags/${tag}`,
      types: {
        'application/rss+xml': `${SITE_URL}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  return Object.keys(tagData as Record<string, number>).map((tag) => ({ tag: encodeURI(tag) }))
}

export const dynamicParams = false

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const posts = getCards((post) => (post.tags ?? []).map((t) => slug(t)).includes(tag))
  if (posts.length === 0) return notFound()

  return (
    <>
      <PageHero
        eyebrow="Topic"
        title={`#${tag}`}
        description={`${posts.length} ${posts.length === 1 ? 'article' : 'articles'} tagged “${tag}”.`}
        breadcrumb={[
          { name: 'Home', href: '/' },
          { name: 'Topics', href: '/tags' },
          { name: `#${tag}`, href: `/tags/${tag}` },
        ]}
      />
      <h2 className="sr-only">Articles tagged {tag}</h2>
      <ArticleGrid posts={posts} />
    </>
  )
}
