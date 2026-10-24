import Link from '@/components/Link'
import Image from 'next/image'
import { ArticleGrid } from '@/components/ArticleCard'
import AdSense from '@/components/AdSense'
import { KBarButton } from 'pliny/search/KBarButton'
import { categories } from '@/data/categories'
import siteMetadata from '@/data/siteMetadata'
import { getCards } from '@/lib/posts'
import {
  ArrowRightIcon,
  SearchIcon,
  ShieldIcon,
  ClockIcon,
  TrophyIcon,
  categoryIcons,
} from '@/components/icons'

const LATEST = 6

function SectionHeading({ title, href, cta }: { title: string; href?: string; cta?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 inline-flex shrink-0 items-center gap-1 text-sm font-semibold"
        >
          {cta} <ArrowRightIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

export default function Home() {
  const posts = getCards()
  const reviews = posts.filter((p) => p.type === 'review')
  const featured = (
    posts.some((p) => p.featured) ? posts.filter((p) => p.featured) : reviews
  ).slice(0, 3)
  const featuredPaths = new Set(featured.map((p) => p.path))
  const latest = posts.filter((p) => !featuredPaths.has(p.path)).slice(0, LATEST)
  const countFor = (slug: string) => posts.filter((p) => p.category === slug).length

  return (
    <>
      {/* Hero */}
      <section className="relative -mx-4 overflow-hidden px-4 pt-14 pb-14 sm:-mx-6 sm:px-6 sm:pt-20 sm:pb-20 lg:-mx-8 lg:px-8">
        <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div className="from-primary-400/25 absolute top-0 left-1/2 -z-10 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-gradient-to-r via-cyan-400/20 to-fuchsia-400/20 blur-3xl" />
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-1 text-xs font-medium text-gray-600 backdrop-blur dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Independent reviews · No
              paid rankings
            </p>
            <h1 className="font-display mt-6 text-4xl leading-[1.1] font-bold tracking-tight text-gray-900 sm:text-5xl xl:text-6xl dark:text-white">
              Find the right tech tools,{' '}
              <span className="from-primary-600 bg-gradient-to-r via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                without the guesswork
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              {siteMetadata.description}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <KBarButton
                aria-label="Search articles"
                className="hover:border-primary-400 flex w-full max-w-md items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 py-3.5 text-left text-gray-500 shadow-sm transition hover:shadow-md sm:w-80 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
              >
                <SearchIcon className="h-5 w-5" />
                <span className="flex-1 truncate text-sm">Search reviews, e.g. “AI writing”</span>
                <kbd className="rounded border border-gray-200 px-1.5 text-[11px] dark:border-gray-700">
                  Ctrl K
                </kbd>
              </KBarButton>
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              >
                Browse reviews <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="from-primary-500/30 absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr to-cyan-400/20 blur-2xl" />
            <Image
              src="/static/images/site/hero.webp"
              alt="Illustration of a TechToolHub review dashboard with ratings, a comparison table and top picks by category"
              width={1867}
              height={1307}
              priority
              sizes="(min-width: 1024px) 520px, (min-width: 640px) 576px, 100vw"
              className="h-auto w-full rounded-3xl shadow-2xl ring-1 shadow-gray-900/20 ring-gray-900/10 dark:ring-white/10"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section aria-labelledby="categories" className="grid gap-4 md:grid-cols-3">
        <h2 id="categories" className="sr-only">
          Categories
        </h2>
        {categories.map((c) => {
          const Icon = categoryIcons[c.icon]
          return (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/60"
            >
              <div
                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} text-white shadow-sm`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                {c.title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {c.description}
              </p>
              <p className="text-primary-600 dark:text-primary-400 mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                {countFor(c.slug)} articles{' '}
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </p>
            </Link>
          )
        })}
      </section>

      {posts.length === 0 && (
        <div className="mt-16 rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center dark:border-gray-700">
          <p className="font-display text-xl font-semibold">Our first reviews are on the way</p>
          <p className="mt-2 text-gray-500">
            We are testing tools right now. Check back very soon.
          </p>
        </div>
      )}

      {featured.length > 0 && (
        <section className="mt-20">
          <SectionHeading title="Editor's picks" href="/reviews" cta="All reviews" />
          <ArticleGrid posts={featured} />
        </section>
      )}

      <AdSense placement="home" className="mt-16" />

      {latest.length > 0 && (
        <section className="mt-16">
          <SectionHeading title="Latest articles" href="/blog" cta="Browse all" />
          <ArticleGrid posts={latest} />
        </section>
      )}

      {/* Trust strip */}
      <section className="mt-20 grid gap-6 rounded-3xl border border-gray-200 bg-gray-50 p-8 sm:grid-cols-3 sm:p-10 dark:border-gray-800 dark:bg-gray-900/50">
        {[
          {
            icon: ShieldIcon,
            title: 'Independent',
            text: 'No vendor pays for a verdict. Affiliate links never change our scores.',
          },
          {
            icon: TrophyIcon,
            title: 'Tested hands-on',
            text: 'Every tool is used on real work and compared with its alternatives.',
          },
          {
            icon: ClockIcon,
            title: 'Kept up to date',
            text: 'We revisit articles when pricing or features change.',
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4">
            <Icon className="text-primary-600 dark:text-primary-400 h-6 w-6 shrink-0" />
            <div>
              <h3 className="font-display font-bold text-gray-900 dark:text-white">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{text}</p>
            </div>
          </div>
        ))}
        <div className="sm:col-span-3">
          <Link
            href="/how-we-review"
            className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline"
          >
            How we review tools →
          </Link>
        </div>
      </section>
    </>
  )
}
