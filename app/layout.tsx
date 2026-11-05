import 'css/tailwind.css'
import 'remark-github-blockquote-alert/alert.css'

import { Inter, Space_Grotesk } from 'next/font/google'
import Script from 'next/script'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { Analytics as VercelAnalytics } from '@vercel/analytics/next'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { SITE_URL } from '@/lib/site'
import CookieConsent from '@/components/CookieConsent'
import AffiliateClickTracker from '@/components/AffiliateClickTracker'
import { consentDefaultsScript } from '@/lib/consent'
import { ThemeProviders } from './theme-providers'
import { Metadata, Viewport } from 'next'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
})

const adsenseClient = siteMetadata.adsense.client
const googleSiteVerification =
  process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteMetadata.title}: ${siteMetadata.tagline}`,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  applicationName: siteMetadata.title,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${SITE_URL}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
  },
  // Google Search Console HTML-tag token (only the content="..." value). Rendered only when set.
  verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
  other: {
    'adsterra-verification': 'A7B2C9D',
    ...(adsenseClient ? { 'google-adsense-account': adsenseClient } : {}),
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0f1a' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang={siteMetadata.language}
      className={`${inter.variable} ${space_grotesk.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Google Consent Mode v2 defaults: must run before any Google tag (GA4, AdSense) */}
        {(siteMetadata.googleAnalyticsId || adsenseClient) && (
          <script
            id="consent-defaults"
            dangerouslySetInnerHTML={{ __html: consentDefaultsScript }}
          />
        )}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${basePath}/static/favicons/apple-touch-icon.png`}
        />
        {/* Google Search shows a favicon only if one is a multiple of 48px: keep 48/96/192 */}
        <link rel="icon" type="image/svg+xml" href={`${basePath}/static/favicons/favicon.svg`} />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href={`${basePath}/static/favicons/android-chrome-192x192.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href={`${basePath}/static/favicons/favicon-96x96.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href={`${basePath}/static/favicons/favicon-48x48.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${basePath}/static/favicons/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${basePath}/static/favicons/favicon-16x16.png`}
        />
        <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
        <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      </head>
      <body className="bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        {adsenseClient && (
          <Script
            id="adsense"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          />
        )}
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          {/* Cookieless page-view counts for every visitor (enable Web Analytics in Vercel) */}
          <VercelAnalytics />
          <CookieConsent
            gaId={siteMetadata.googleAnalyticsId}
            adNetwork={
              adsenseClient ? 'adsense' : siteMetadata.adsterra.enabled ? 'adsterra' : undefined
            }
          />
          <AffiliateClickTracker />
          <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-80 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow"
            >
              Skip to content
            </a>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main id="main" className="flex-1 overflow-x-clip">
                <SectionContainer>{children}</SectionContainer>
              </main>
              <Footer />
            </div>
          </SearchProvider>
        </ThemeProviders>
      </body>
    </html>
  )
}
