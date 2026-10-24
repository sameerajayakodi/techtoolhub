import { ReactNode } from 'react'
import { ArrowRightIcon, ExternalIcon } from '../icons'

interface CTAButtonProps {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  /** Affiliate / paid links get rel="sponsored" (Google requirement). Defaults to true for external links. */
  sponsored?: boolean
}

/**
 * Call-to-action button for affiliate or product links.
 * MDX: <CTAButton href="https://example.com/?ref=you">Try Example free</CTAButton>
 */
export default function CTAButton({
  href,
  children,
  variant = 'primary',
  sponsored,
}: CTAButtonProps) {
  const external = /^https?:\/\//.test(href)
  const isSponsored = sponsored ?? external
  const rel = external
    ? ['noopener', 'noreferrer', isSponsored && 'sponsored nofollow'].filter(Boolean).join(' ')
    : undefined

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={rel}
      className={`not-prose group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold no-underline! shadow-sm transition-all ${
        variant === 'primary'
          ? 'bg-primary-600 hover:bg-primary-700 hover:shadow-primary-600/20 text-white! hover:shadow-md'
          : 'border border-gray-300 bg-white text-gray-900! hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white!'
      }`}
    >
      {children}
      {external ? (
        <ExternalIcon className="h-4 w-4 opacity-80" />
      ) : (
        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      )}
    </a>
  )
}
