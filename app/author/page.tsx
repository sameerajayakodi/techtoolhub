import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent } from 'pliny/utils/contentlayer'
import Image from '@/components/Image'
import Link from '@/components/Link'
import PageHero from '@/components/PageHero'
import SocialIcon from '@/components/social-icons'
import { ArticleGrid } from '@/components/ArticleCard'
import { components } from '@/components/MDXComponents'
import { genPageMetadata } from 'app/seo'
import { getAuthor, authorLinks } from '@/lib/authors'
import { getCards } from '@/lib/posts'
import { breadcrumbJsonLd, personJsonLd, toJsonLd } from '@/lib/structured-data'

const author = getAuthor('default')

export const metadata = genPageMetadata({
  title: `${author.name}, author`,
  description: `About ${author.name}${author.occupation ? `, ${author.occupation}` : ''}, who researches and writes every article on TechToolHub.`,
  path: '/author',
})

export default function AuthorPage() {
  const links = authorLinks(author)
  const posts = getCards((p) => (p.authors ?? ['default']).includes(author.slug))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'ProfilePage',
                mainEntity: {
                  ...personJsonLd(coreContent(author)),
                  ...(author.email && { email: author.email }),
                },
              },
              breadcrumbJsonLd([
                { name: 'Home', path: '/' },
                { name: author.name, path: '/author' },
              ]),
            ],
          }),
        }}
      />
      <div className="mx-auto max-w-3xl">
        <PageHero
          eyebrow="Author"
          title={author.name}
          description={author.occupation}
          breadcrumb={[
            { name: 'Home', href: '/' },
            { name: 'Author', href: '/author' },
          ]}
        />
        <div className="flex flex-col gap-8 border-t border-gray-200 pt-8 sm:flex-row dark:border-gray-800">
          {author.avatar && (
            <Image
              src={author.avatar}
              alt={`Photo of ${author.name}`}
              width={160}
              height={160}
              className="h-40 w-40 shrink-0 rounded-full object-cover"
            />
          )}
          <div className="min-w-0">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <MDXLayoutRenderer code={author.body.code} components={components} />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              {links.map((l) => (
                <SocialIcon key={l.kind} kind={l.kind} href={l.href} size={6} />
              ))}
              {author.email && <SocialIcon kind="mail" href={`mailto:${author.email}`} size={6} />}
            </div>
            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              Read{' '}
              <Link href="/how-we-review" className="text-primary-600 dark:text-primary-400">
                how I research and review tools
              </Link>{' '}
              and the{' '}
              <Link href="/affiliate-disclosure" className="text-primary-600 dark:text-primary-400">
                affiliate disclosure
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
      {posts.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Articles by {author.name}
          </h2>
          <ArticleGrid posts={posts} />
        </section>
      )}
    </>
  )
}
