import { MDXLayoutRenderer } from 'pliny/mdx-components'
import Image from '@/components/Image'
import Link from '@/components/Link'
import SocialIcon from '@/components/social-icons'
import { getAuthor, authorLinks } from '@/lib/authors'

/** "About the author" box at the end of every article. Content comes from data/authors/<slug>.mdx */
export default function AuthorBox({ slug = 'default' }: { slug?: string }) {
  const author = getAuthor(slug)
  const links = authorLinks(author)
  return (
    <section
      aria-labelledby="author-box-title"
      className="mt-10 flex flex-col gap-5 rounded-2xl border border-gray-200 p-5 sm:flex-row dark:border-gray-800"
    >
      {author.avatar && (
        <Image
          src={author.avatar}
          alt={`Photo of ${author.name}`}
          width={80}
          height={80}
          className="h-20 w-20 shrink-0 rounded-full object-cover"
        />
      )}
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
          About the author
        </p>
        <h2
          id="author-box-title"
          className="font-display mt-1 text-lg font-bold text-gray-900 dark:text-white"
        >
          <Link href="/author" className="hover:text-primary-600 dark:hover:text-primary-400">
            {author.name}
          </Link>
        </h2>
        {author.occupation && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{author.occupation}</p>
        )}
        <div className="prose prose-sm prose-gray dark:prose-invert mt-2 max-w-none">
          <MDXLayoutRenderer code={author.body.code} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
          {links.map((l) => (
            <SocialIcon key={l.kind} kind={l.kind} href={l.href} size={5} />
          ))}
          <Link
            href="/author"
            className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            More about me
          </Link>
        </div>
      </div>
    </section>
  )
}
