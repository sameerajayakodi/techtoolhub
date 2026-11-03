'use client'

import { useEffect } from 'react'
import { hasAnalyticsConsent } from '@/lib/consent'

/**
 * Sends a GA4 "affiliate_click" event for every click on a /go/<tool> link or an affiliate
 * button (data-affiliate, which also covers directLink tools).
 * Only sent when the visitor accepted analytics cookies (components/CookieConsent.tsx), so
 * nothing is tracked without consent. Find the events in GA4 → Reports → Engagement → Events.
 */
export default function AffiliateClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[data-affiliate], a[href^="/go/"]')
      if (!link || !window.gtag || !hasAnalyticsConsent()) return
      const href = link.getAttribute('href') ?? ''
      window.gtag('event', 'affiliate_click', {
        tool: link.getAttribute('data-affiliate') ?? href.split('/')[2],
        placement: link.getAttribute('data-placement') ?? 'inline',
        page_path: window.location.pathname,
        transport_type: 'beacon',
      })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])
  return null
}
