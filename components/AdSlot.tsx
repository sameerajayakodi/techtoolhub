'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import AdsterraBanner, { AdsterraBannerSize } from './AdsterraBanner'

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

const banners = siteMetadata.adsterra.banners

/** Adsterra banner sizes per position, largest first (the first that fits is shown) */
const adsterraSizes: Record<AdPosition, AdsterraBannerSize[]> = {
  afterIntro: [banners.leaderboard, banners.banner, banners.rectangle],
  midArticle: [banners.rectangle],
  endOfArticle: [banners.leaderboard, banners.banner, banners.rectangle],
  sidebar: [banners.halfSkyscraper],
  home: [banners.leaderboard, banners.banner, banners.mobile],
}

/**
 * Positions left out below the `sm` breakpoint. On a phone every banner is a 300x250 that fills
 * the screen, so articles keep just two (after the intro and at the end). A hidden container
 * has no width, so AdsterraBanner loads nothing there.
 */
const hiddenOnPhones = new Set<AdPosition>(['midArticle'])

/** Approximate Adsterra banner height at each breakpoint (article column / home width) */
const adsterraReservedHeight: Record<AdPosition, string> = {
  afterIntro: 'min-h-[250px] sm:min-h-[60px] xl:min-h-[90px]',
  midArticle: 'min-h-[250px]',
  endOfArticle: 'min-h-[250px] sm:min-h-[60px] xl:min-h-[90px]',
  sidebar: 'min-h-[300px]',
  home: 'min-h-[50px] sm:min-h-[60px] lg:min-h-[90px]',
}

/**
 * A fixed ad placement: Google AdSense when its client and slot ID for this position are set
 * (NEXT_PUBLIC_ADSENSE_CLIENT, NEXT_PUBLIC_ADSENSE_SLOT_*), otherwise an Adsterra banner
 * (siteMetadata.adsterra). Renders nothing when neither is configured.
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

  const useAdSense = Boolean(client && slot)
  if (!useAdSense && !siteMetadata.adsterra.enabled) return null

  return (
    <aside
      className={`not-prose my-10 ${hiddenOnPhones.has(position) ? 'hidden sm:block' : ''} ${className}`}
      aria-label="Advertisement"
    >
      <p className="mb-1 text-center text-[10px] tracking-widest text-gray-400 uppercase">
        Advertisement
      </p>
      {useAdSense ? (
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
      ) : (
        <div className={adsterraReservedHeight[position]}>
          <AdsterraBanner sizes={adsterraSizes[position]} />
        </div>
      )}
    </aside>
  )
}
