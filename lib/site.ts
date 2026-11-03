import siteMetadata from '@/data/siteMetadata'

/** Canonical origin, e.g. "https://www.techtoolhub.online" (no trailing slash). Defined in data/siteMetadata.js */
export const SITE_URL: string = siteMetadata.siteUrl

/** Absolute URL on the canonical domain for a site path ("/blog/x" → "https://www.…/blog/x") */
export const absoluteUrl = (path = '/') =>
  /^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
