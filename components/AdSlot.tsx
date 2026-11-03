'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

export type AdPosition = keyof typeof siteMetadata.adsense.slots

/**
 * Space reserved for each position before the ad loads, so the page doesn't jump when it
 * arrives (Cumulative Layout Shift). Matches the usual responsive display ad heights.
 */
const reservedHeight: Record<AdPosition, string> = {
  afterIntro: 'min-h-[280px]',
  midArticle: 'min-h-[280px]',
  endOfArticle: 'min-h-[280px]',
  sidebar: 'min-h-[600px]',
  home: 'min-h-[250px]',
}

/**
 * A fixed Google AdSense placement.
 *
 * Renders nothing at all until NEXT_PUBLIC_ADSENSE_CLIENT and the slot ID for this position
 * (NEXT_PUBLIC_ADSENSE_SLOT_*) are set, so no empty boxes appear before AdSense is approved.
 * Without slot IDs, Auto ads (turned on in the AdSense dashboard) decide placements instead.
 *
 * Placement rules:
 * - afterIntro: in MDX, after the intro and the VerdictBox/quick-comparison table. Never above
 *   the VerdictBox.
 * - midArticle: in MDX, between two sections. Never inside a ComparisonTable, ProsCons or
 *   ToolCard, and not directly next to an affiliate button.
 * - endOfArticle and sidebar: added by layouts/PostLayout.tsx. home: app/page.tsx.
 *
 * MDX: <AdSlot position="midArticle" />
 */
export default function AdSlot({
  position,
  className = '',
}: {
  position: AdPosition
  className?: string
}) {
  const client = siteMetadata.adsense.client
  const slot = siteMetadata.adsense.slots[position]
  const ref = useRef<HTMLModElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!client || !slot || !ref.current) return
    // Avoid pushing twice into the same <ins> (React strict mode re-runs effects in dev)
    if (ref.current.getAttribute('data-adsbygoogle-status')) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense not ready / blocked by an ad blocker: fail silently
    }
  }, [client, slot, pathname])

  if (!client || !slot) return null

  return (
    <aside className={`not-prose my-10 ${className}`} aria-label="Advertisement">
      <p className="mb-1 text-center text-[10px] tracking-widest text-gray-400 uppercase">
        Advertisement
      </p>
      <div className={reservedHeight[position]}>
        <ins
          key={pathname}
          ref={ref}
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={position === 'sidebar' ? 'vertical' : 'auto'}
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  )
}
