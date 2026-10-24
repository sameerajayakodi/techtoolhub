import { allPages } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { notFound } from 'next/navigation'
import { components } from '@/components/MDXComponents'
import PageHero from '@/components/PageHero'
import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from 'app/seo'

/**
 * Standard pages (About, Contact, Privacy Policy, Terms, ...) rendered from data/pages/*.mdx.
 * Add a new page by dropping a new .mdx file into data/pages; its file name becomes the URL.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return allPages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const page = allPages.find((p) => p.slug === slug)
  if (!page) return
  return genPageMetadata({ title: page.title, description: page.summary, path: `/${slug}` })
}

export default async function StaticPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const page = allPages.find((p) => p.slug === slug)
  if (!page) return notFound()

  return (
    <div className="mx-auto max-w-3xl">
      <PageHero
        title={page.title}
        description={page.summary}
        breadcrumb={[
          { name: 'Home', href: '/' },
          { name: page.title, href: `/${slug}` },
        ]}
      />
      {page.lastmod && (
        <p className="-mt-2 mb-8 text-sm text-gray-500 dark:text-gray-400">
          Last updated{' '}
          {new Date(page.lastmod).toLocaleDateString(siteMetadata.locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      )}
      <div className="prose prose-gray dark:prose-invert prose-headings:font-display max-w-none border-t border-gray-200 pt-8 dark:border-gray-800">
        <MDXLayoutRenderer code={page.body.code} components={components} />
      </div>
    </div>
  )
}
