/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'TechToolHub',
  author: 'TechToolHub Editorial Team',
  headerTitle: 'TechToolHub',
  tagline: 'Honest reviews of AI, developer & productivity tools',
  description:
    'Independent, hands-on reviews and comparisons of the best AI tools, developer tools and productivity software, so you can pick the right tool faster.',
  language: 'en-us',
  theme: 'system', // system, dark or light
  // Change this when you add a custom domain (or set NEXT_PUBLIC_SITE_URL on Vercel)
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://techtoolhub.vercel.app',
  siteRepo: 'https://github.com/sameerajayakodi/techtoolhub',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/opengraph-image`,
  email: 'hello@techtoolhub.com',
  // Leave a social link empty ('') to hide its icon in the footer
  github: '',
  x: '',
  facebook: '',
  youtube: '',
  linkedin: '',
  threads: '',
  instagram: '',
  medium: '',
  bluesky: '',
  mastodon: '',
  locale: 'en-US',
  stickyNav: true,

  /**
   * Google AdSense
   * 1. Set NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX on Vercel (and in .env.local).
   *    That alone loads the AdSense script, the verification meta tag and /ads.txt, which is
   *    all "Auto ads" needs.
   * 2. Optional: create display ad units in AdSense and set their slot IDs below to get
   *    fixed placements at the top, middle and bottom of articles.
   */
  adsense: {
    client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '',
    slots: {
      articleTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_TOP || '',
      inArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE || '',
      articleBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_BOTTOM || '',
      sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '',
      home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || '',
    },
  },

  analytics: {
    // Loads in production only, and only when the env variable is set.
    // If you add another provider, also allow its domain in the CSP in `next.config.js`.
    ...(process.env.NEXT_PUBLIC_GA_ID && {
      googleAnalytics: { googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID }, // e.g. G-XXXXXXX
    }),
  },

  // Comments are optional. Fill the NEXT_PUBLIC_GISCUS_* variables (https://giscus.app) to enable them.
  ...(process.env.NEXT_PUBLIC_GISCUS_REPO && {
    comments: {
      provider: 'giscus',
      giscusConfig: {
        repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
        repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
        category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
        categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
        mapping: 'pathname',
        reactions: '1',
        metadata: '0',
        theme: 'light',
        darkTheme: 'transparent_dark',
        themeURL: '',
        lang: 'en',
      },
    },
  }),

  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
}

module.exports = siteMetadata
