import { allAuthors } from 'contentlayer/generated'
import type { Authors } from 'contentlayer/generated'

/** Full author document (including the MDX bio) from data/authors/<slug>.mdx */
export function getAuthor(slug = 'default'): Authors {
  const author =
    allAuthors.find((a) => a.slug === slug) ?? allAuthors.find((a) => a.slug === 'default')
  if (!author) throw new Error('Missing data/authors/default.mdx')
  return author
}

/** Profile links shown in the author box and on /author (empty values are skipped) */
export function authorLinks(a: Pick<Authors, 'linkedin' | 'github' | 'twitter' | 'bluesky'>) {
  return [
    { kind: 'linkedin', label: 'LinkedIn', href: a.linkedin },
    { kind: 'github', label: 'GitHub', href: a.github },
    { kind: 'x', label: 'X', href: a.twitter },
    { kind: 'bluesky', label: 'Bluesky', href: a.bluesky },
  ].filter(
    (l): l is { kind: 'linkedin' | 'github' | 'x' | 'bluesky'; label: string; href: string } =>
      Boolean(l.href)
  )
}
