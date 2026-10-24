import Link from './Link'
import Logo from './Logo'
import siteMetadata from '@/data/siteMetadata'
import { categories } from '@/data/categories'
import SocialIcon from '@/components/social-icons'
import { RssIcon } from './icons'

const columns = [
  {
    title: 'Categories',
    links: [
      ...categories.map((c) => ({ href: `/${c.slug}`, title: c.title })),
      { href: '/reviews', title: 'All Reviews' },
      { href: '/blog', title: 'All Articles' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', title: 'About Us' },
      { href: '/contact', title: 'Contact Us' },
      { href: '/how-we-review', title: 'How We Review' },
      { href: '/affiliate-disclosure', title: 'Affiliate Disclosure' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy-policy', title: 'Privacy Policy' },
      { href: '/terms', title: 'Terms of Use' },
      { href: '/disclaimer', title: 'Disclaimer' },
    ],
  },
]

const socials = [
  'github',
  'x',
  'linkedin',
  'youtube',
  'facebook',
  'instagram',
  'threads',
  'bluesky',
  'mastodon',
  'medium',
] as const

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200 bg-gray-50/70 dark:border-gray-800 dark:bg-gray-900/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-5 lg:px-8">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2.5" aria-label="TechToolHub home">
            <Logo className="h-8 w-8" />
            <span className="font-display text-lg font-bold">
              TechTool<span className="text-primary-600 dark:text-primary-400">Hub</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-600 dark:text-gray-400">
            {siteMetadata.description}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {siteMetadata.email && (
              <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
            )}
            {socials.map(
              (kind) =>
                siteMetadata[kind] && (
                  <SocialIcon key={kind} kind={kind} href={siteMetadata[kind]} size={5} />
                )
            )}
            <a
              href="/feed.xml"
              className="hover:text-primary-500 dark:hover:text-primary-400 text-gray-700 transition dark:text-gray-200"
              aria-label="RSS feed"
            >
              <RssIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="text-xs font-semibold tracking-wider text-gray-900 uppercase dark:text-white">
              {col.title}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-primary-600 dark:hover:text-primary-400 text-sm text-gray-600 dark:text-gray-400"
                  >
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} {siteMetadata.title}. All rights reserved.
          </p>
          <p>
            Some links are affiliate links. We may earn a commission at no extra cost to you.{' '}
            <Link href="/affiliate-disclosure" className="hover:text-primary-600 underline">
              Learn more
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
