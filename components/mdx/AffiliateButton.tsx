import { ReactNode } from 'react'
import { AFFILIATE_REL, goPath, requireTool } from '@/lib/affiliates'
import { ExternalIcon } from '../icons'

interface AffiliateButtonProps {
  /** Tool slug from lib/affiliates.ts, e.g. "cursor" */
  tool: string
  /** Button text. Defaults to "Try <tool name>" */
  children?: ReactNode
  variant?: 'primary' | 'secondary'
  /** Where the button sits, sent with the click event (e.g. "verdict-box", "end") */
  placement?: string
}

/**
 * Outbound button that goes through /go/<tool> (your affiliate link once you have one, the
 * official site until then). Opens in a new tab with rel="sponsored nofollow noopener".
 *
 * MDX: <AffiliateButton tool="cursor">Try Cursor free</AffiliateButton>
 */
export default function AffiliateButton({
  tool,
  children,
  variant = 'primary',
  placement,
}: AffiliateButtonProps) {
  const info = requireTool(tool)
  return (
    <a
      href={goPath(tool)}
      target="_blank"
      rel={AFFILIATE_REL}
      data-affiliate={tool}
      data-placement={placement}
      className={`not-prose inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold no-underline! shadow-sm transition-all ${
        variant === 'primary'
          ? 'bg-primary-600 hover:bg-primary-700 hover:shadow-primary-600/20 text-white! hover:shadow-md'
          : 'border border-gray-300 bg-white text-gray-900! hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white!'
      }`}
    >
      {children ?? `Try ${info.name}`}
      <ExternalIcon className="h-4 w-4 opacity-80" />
    </a>
  )
}
