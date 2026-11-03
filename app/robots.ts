import { MetadataRoute } from 'next'
import { SITE_URL as siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  // Keep Vercel preview deployments out of Google; only production is indexable
  const isPreview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'

  return {
    rules: isPreview
      ? { userAgent: '*', disallow: '/' }
      : [
          // /go/ are outbound affiliate redirects (app/go/[tool]/route.ts)
          { userAgent: '*', allow: '/', disallow: ['/api/', '/go/'] },
          // Lets AdSense crawl every page so it can match relevant ads
          { userAgent: 'Mediapartners-Google', allow: '/' },
        ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
