import 'css/prism.css'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import type { Authors, Blog } from 'contentlayer/generated'
import PostLayout from '@/layouts/PostLayout'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import { getPosts, getRelated } from '@/lib/posts'
import { postJsonLd, toJsonLd } from '@/lib/structured-data'

const isProduction = process.env.NODE_ENV === 'production'

function getAuthors(post?: Blog) {
  return (post?.authors || ['default']).map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allBlogs.find((p) => p.slug === slug)
  if (!post) {
    return
  }
  const authorDetails = getAuthors(post)

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  // Branded social card from app/og/[...slug]/route.tsx
  const ogImage = `/og/${post.slug}`

  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags,
    authors: authors.map((name) => ({ name })),
    alternates: { canonical: post.canonicalUrl || `/${post.path}` },
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: `/${post.path}`,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
      section: post.category,
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [ogImage],
    },
    robots: post.draft ? { index: false, follow: false } : undefined,
  }
}

export const generateStaticParams = async () => {
  return allBlogs
    .filter((p) => !isProduction || p.draft !== true)
    .map((p) => ({ slug: p.slug.split('/').map((name) => decodeURI(name)) }))
}

export const dynamicParams = false

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  // Drafts are filtered out in production
  const sortedCoreContents = getPosts()
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = allBlogs.find((p) => p.slug === slug) as Blog
  const authorDetails = getAuthors(post)
  const mainContent = coreContent(post)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(postJsonLd(mainContent, authorDetails)) }}
      />
      <PostLayout
        content={mainContent}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
        related={getRelated(mainContent)}
      >
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </PostLayout>
    </>
  )
}
