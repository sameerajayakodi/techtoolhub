import { slug } from 'github-slugger'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import PageHero from '@/components/PageHero'
import { ArticleGrid } from '@/components/ArticleCard'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { getCards } from '@/lib/posts'

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: `#${tag}`,
    description: `${siteMetadata.title} reviews and guides about ${tag}.`,
    path: `/tags/${tag}`,
    alternates: {
      canonical: `/tags/${tag}`,
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
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
      <ArticleGrid posts={posts} />
    </>
  )
}
