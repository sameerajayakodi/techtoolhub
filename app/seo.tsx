import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

interface PageSEOProps {
  title: string
  description?: string
  /** Canonical path of the page, e.g. "/ai-tools" */
  path?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

/** Metadata helper for listing / static pages. Uses the site-wide social card from app/opengraph-image.tsx. */
export function genPageMetadata({ title, description, path, ...rest }: PageSEOProps): Metadata {
  return {
    title,
    description: description || siteMetadata.description,
    alternates: { canonical: path ?? './' },
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: path ?? './',
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'website',
      images: [siteMetadata.socialBanner],
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      card: 'summary_large_image',
      images: [siteMetadata.socialBanner],
    },
    ...rest,
  }
}
