import { MetadataRoute } from 'next'
import { allBlogs, allPages } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { categories } from '@/data/categories'
import tagData from 'app/tag-data.json'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl.replace(/\/$/, '')
  const published = allBlogs.filter((post) => !post.draft)
  const latest = published
    .map((p) => p.lastmod || p.date)
    .sort()
    .at(-1)
  const today = new Date().toISOString().split('T')[0]

  const blogRoutes: MetadataRoute.Sitemap = published.map((post) => ({
    url: `${siteUrl}/${post.path}`,
    lastModified: post.lastmod || post.date,
    changeFrequency: 'monthly',
    priority: post.format === 'review' || post.format === 'listicle' ? 0.9 : 0.8,
  }))

  const hubRoutes: MetadataRoute.Sitemap = [
    { path: '', priority: 1 },
    ...categories.map((c) => ({ path: `/${c.slug}`, priority: 0.9 })),
    { path: '/reviews', priority: 0.9 },
    { path: '/blog', priority: 0.7 },
    { path: '/tags', priority: 0.4 },
  ].map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: latest || today,
    changeFrequency: 'daily',
    priority,
  }))

  const pageRoutes: MetadataRoute.Sitemap = allPages.map((page) => ({
    url: `${siteUrl}/${page.slug}`,
    lastModified: page.lastmod || today,
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  const tagRoutes: MetadataRoute.Sitemap = Object.keys(tagData).map((tag) => ({
    url: `${siteUrl}/tags/${tag}`,
    lastModified: latest || today,
    changeFrequency: 'weekly',
    priority: 0.4,
  }))

  return [...hubRoutes, ...blogRoutes, ...pageRoutes, ...tagRoutes]
}
