'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

type SlotName = keyof typeof siteMetadata.adsense.slots

interface AdSenseProps {
  /** An AdSense ad-unit slot ID, or one of the named slots in siteMetadata.adsense.slots */
  slot?: string
  /** Shortcut for a named slot, e.g. <AdSense placement="inArticle" /> */
  placement?: SlotName
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical'
  layout?: 'in-article'
  className?: string
}

/**
 * Reusable Google AdSense unit.
 *
 * - Renders nothing in production until NEXT_PUBLIC_ADSENSE_CLIENT and a slot ID are set,
 *   so pages never show empty boxes before your account is approved.
 * - In development it shows a dashed placeholder so you can see where ads will go.
 * - The AdSense script itself is loaded once in app/layout.tsx.
 *
 * In MDX: <AdSense placement="inArticle" />  or  <AdSense slot="1234567890" />
 */
export default function AdSense({
  slot,
  placement = 'inArticle',
  format = 'auto',
  layout,
  className = '',
}: AdSenseProps) {
  const client = siteMetadata.adsense.client
  const adSlot = slot || siteMetadata.adsense.slots[placement]
  const ref = useRef<HTMLModElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!client || !adSlot || !ref.current) return
    // Avoid pushing twice into the same <ins> (React strict mode re-runs effects in dev)
    if (ref.current.getAttribute('data-adsbygoogle-status')) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense not ready / blocked by an ad blocker: fail silently
    }
  }, [client, adSlot, pathname])

  if (!client || !adSlot) {
    if (process.env.NODE_ENV !== 'development') return null
    return (
      <div
        className={`not-prose my-8 flex h-28 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-xs font-medium tracking-wide text-gray-400 uppercase dark:border-gray-700 dark:text-gray-500 ${className}`}
      >
        Ad slot · {slot ? `#${slot}` : String(placement)}
      </div>
    )
  }

  return (
    <aside className={`not-prose my-8 ${className}`} aria-label="Advertisement">
      <p className="mb-1 text-center text-[10px] tracking-widest text-gray-400 uppercase">
        Advertisement
      </p>
      <ins
        key={pathname}
        ref={ref}
        className="adsbygoogle block"
        style={{ display: 'block', textAlign: layout === 'in-article' ? 'center' : undefined }}
        data-ad-client={client}
        data-ad-slot={adSlot}
        data-ad-format={layout === 'in-article' ? 'fluid' : format}
        data-ad-layout={layout}
        data-full-width-responsive="true"
      />
    </aside>
  )
}
