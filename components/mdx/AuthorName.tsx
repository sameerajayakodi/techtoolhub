import { getAuthor } from '@/lib/authors'

/**
 * The author's name from data/authors/<slug>.mdx, so it is only set in one place.
 * MDX: I'm <AuthorName />, ...
 */
export default function AuthorName({ slug = 'default' }: { slug?: string }) {
  return <>{getAuthor(slug).name}</>
}
