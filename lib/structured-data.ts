import type { Blog, Authors } from 'contentlayer/generated'
import type { CoreContent } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import { getCategory } from '@/data/categories'

const siteUrl = siteMetadata.siteUrl.replace(/\/$/, '')
const abs = (path: string) => (path.startsWith('http') ? path : `${siteUrl}${path}`)

export interface Product {
  name: string
  url?: string
  brand?: string
  price?: string | number
  priceCurrency?: string
  platforms?: string
  appCategory?: string
}

export const organization = {
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: siteMetadata.title,
  url: siteUrl,
  logo: { '@type': 'ImageObject', url: abs('/static/images/logo.png'), width: 512, height: 512 },
}

/** Site-wide WebSite + Organization graph (rendered in the root layout) */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: siteMetadata.title,
        description: siteMetadata.description,
        inLanguage: siteMetadata.language,
        publisher: { '@id': `${siteUrl}/#organization` },
      },
    ],
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  }
}

/**
 * Article JSON-LD for every post, plus a Review (with SoftwareApplication + Rating) when the
 * post is a review that has `rating` and `product.name` in its frontmatter.
 */
export function postJsonLd(post: CoreContent<Blog>, authors: CoreContent<Authors>[]) {
  const url = abs(`/${post.path}`)
  const image = abs(`/og/${post.slug}`)
  const category = getCategory(post.category)
  const author = authors.map((a) => ({
    '@type': 'Person',
    name: a.name,
    ...(a.linkedin || a.twitter ? { sameAs: [a.linkedin, a.twitter].filter(Boolean) } : {}),
  }))

  const article = {
    '@type': post.format === 'news' ? 'NewsArticle' : 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.summary,
    image,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.lastmod || post.date).toISOString(),
    author,
    publisher: { '@id': `${siteUrl}/#organization` },
    mainEntityOfPage: url,
    articleSection: category.title,
    keywords: post.tags?.join(', '),
    inLanguage: siteMetadata.language,
  }

  const graph: Record<string, unknown>[] = [
    organization,
    article,
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: category.title, path: `/${category.slug}` },
      { name: post.title, path: `/${post.path}` },
    ]),
  ]

  const product = post.product as Product | undefined
  if (post.format === 'review' && typeof post.rating === 'number' && product?.name) {
    graph.push({
      '@type': 'Review',
      '@id': `${url}#review`,
      name: post.title,
      reviewBody: post.verdict || post.summary,
      datePublished: new Date(post.date).toISOString(),
      author,
      publisher: { '@id': `${siteUrl}/#organization` },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: post.rating,
        bestRating: 5,
        worstRating: 1,
      },
      itemReviewed: {
        '@type': 'SoftwareApplication',
        name: product.name,
        applicationCategory: product.appCategory || 'BusinessApplication',
        operatingSystem: product.platforms || 'Web',
        ...(product.url && { url: product.url }),
        ...(product.brand && { brand: { '@type': 'Brand', name: product.brand } }),
        ...(product.price !== undefined && {
          offers: {
            '@type': 'Offer',
            price: String(product.price).replace(/[^0-9.]/g, '') || '0',
            priceCurrency: product.priceCurrency || 'USD',
          },
        }),
      },
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

/** Safe for <script type="application/ld+json"> (no "</script>" break-outs) */
export const toJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')
