/* eslint-disable jsx-a11y/anchor-has-content */
import Link from 'next/link'
import type { LinkProps } from 'next/link'
import { AnchorHTMLAttributes } from 'react'
import { AFFILIATE_REL } from '@/lib/affiliates'

const GO_PREFIX = '/go/'

const CustomLink = ({ href, ...rest }: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  // /go/<tool> is an outbound affiliate redirect: plain <a> (never prefetched), new tab, sponsored
  if (href && href.startsWith(GO_PREFIX)) {
    return (
      <a
        className="break-words"
        target="_blank"
        rel={AFFILIATE_REL}
        data-affiliate={href.slice(GO_PREFIX.length)}
        href={href}
        {...rest}
      />
    )
  }

  if (isInternalLink) {
    return <Link className="break-words" href={href} {...rest} />
  }

  if (isAnchorLink) {
    return <a className="break-words" href={href} {...rest} />
  }

  return (
    <a className="break-words" target="_blank" rel="noopener noreferrer" href={href} {...rest} />
  )
}

export default CustomLink
