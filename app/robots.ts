import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = siteMetadata.siteUrl.replace(/\/$/, '')
  // Keep Vercel preview deployments out of Google; only production is indexable
  const isPreview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'

  return {
    rules: isPreview
      ? { userAgent: '*', disallow: '/' }
      : [
          { userAgent: '*', allow: '/', disallow: ['/api/'] },
          // Lets AdSense crawl every page so it can match relevant ads
          { userAgent: 'Mediapartners-Google', allow: '/' },
        ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
