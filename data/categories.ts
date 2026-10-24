/**
 * Site categories. The `slug` must match the `category` frontmatter value of a post
 * (see the `category` enum in contentlayer.config.ts).
 * To add a category: add it here, add it to the enum, and create app/<slug>/page.tsx.
 */
export const categories = [
  {
    slug: 'ai-tools',
    title: 'AI Tools',
    description:
      'Hands-on reviews of AI writing, image, video and chat assistants — what they are actually good at, and what they cost.',
    icon: 'sparkles',
    gradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
    accent: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10',
  },
  {
    slug: 'developer-tools',
    title: 'Developer Tools',
    description:
      'IDEs, AI coding assistants, hosting, databases and DevOps tools tested by working developers.',
    icon: 'code',
    gradient: 'from-sky-500 via-cyan-500 to-teal-400',
    accent: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10',
  },
  {
    slug: 'productivity',
    title: 'Productivity',
    description:
      'Note-taking, project management, automation and focus apps that genuinely save you time.',
    icon: 'bolt',
    gradient: 'from-emerald-500 via-teal-500 to-lime-400',
    accent: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
  },
] as const

export type CategorySlug = (typeof categories)[number]['slug']
export type Category = (typeof categories)[number]

export const getCategory = (slug?: string): Category =>
  categories.find((c) => c.slug === slug) ?? categories[0]

/** Article formats, set with the `type` frontmatter field */
export const articleTypes = {
  review: 'Review',
  listicle: 'Best Of',
  comparison: 'Comparison',
  guide: 'Guide',
  news: 'News',
} as const

export type ArticleType = keyof typeof articleTypes
