import { allBlogs } from 'contentlayer/generated'
import type { Blog } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import type { CoreContent } from 'pliny/utils/contentlayer'
import type { ArticleType, CategorySlug } from '@/data/categories'

/** The small, serialisable slice of a post that cards and the client-side filter need */
export interface PostCardData {
  slug: string
  path: string
  title: string
  summary: string
  date: string
  tags: string[]
  category: CategorySlug
  type: ArticleType
  rating?: number
  verdict?: string
  image?: string
  readingTime: string
  featured: boolean
}

/** Published posts, newest first (drafts are included in development only) */
export function getPosts(): CoreContent<Blog>[] {
  return allCoreContent(sortPosts(allBlogs))
}

export function getPostImage(images: unknown): string | undefined {
  if (!images) return undefined
  if (typeof images === 'string') return images
  if (Array.isArray(images) && typeof images[0] === 'string') return images[0]
  return undefined
}

export function toCard(post: CoreContent<Blog>): PostCardData {
  return {
    slug: post.slug,
    path: post.path,
    title: post.title,
    summary: post.summary,
    date: post.date,
    tags: post.tags ?? [],
    category: post.category as CategorySlug,
    type: (post.format ?? 'guide') as ArticleType,
    rating: post.rating,
    verdict: post.verdict,
    image: getPostImage(post.images),
    readingTime: post.readingTime?.text ?? '',
    featured: Boolean(post.featured),
  }
}

export function getCards(filter?: (post: CoreContent<Blog>) => boolean): PostCardData[] {
  const posts = getPosts()
  return (filter ? posts.filter(filter) : posts).map(toCard)
}

/** Posts in the same category first, then by shared tags */
export function getRelated(post: CoreContent<Blog>, limit = 3): PostCardData[] {
  const others = getPosts().filter((p) => p.slug !== post.slug)
  const score = (p: CoreContent<Blog>) =>
    (p.category === post.category ? 10 : 0) +
    (p.tags ?? []).filter((t) => post.tags?.includes(t)).length
  return others
    .map((p) => ({ p, s: score(p) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ p }) => toCard(p))
}
