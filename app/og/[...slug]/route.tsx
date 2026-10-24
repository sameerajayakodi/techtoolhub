import { allBlogs } from 'contentlayer/generated'
import { renderOgImage } from '@/lib/og'
import { articleTypes, getCategory, type ArticleType } from '@/data/categories'

/**
 * Per-article social card: /og/<post-slug>
 * Prerendered as static PNGs at build time. (An opengraph-image file can't live inside the
 * blog's catch-all [...slug] route, so it is served from here instead.)
 */
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return allBlogs
    .filter((p) => process.env.NODE_ENV !== 'production' || p.draft !== true)
    .map((p) => ({ slug: p.slug.split('/') }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const post = allBlogs.find((p) => p.slug === decodeURI(slug.join('/')))
  if (!post) return new Response('Not found', { status: 404 })
  const category = getCategory(post.category)

  return renderOgImage({
    title: post.title,
    category: category.slug,
    eyebrow: `${category.title} · ${articleTypes[(post.format ?? 'guide') as ArticleType]}`,
    rating: post.format === 'review' ? post.rating : undefined,
  })
}
