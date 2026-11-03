'use client'

import { useEffect } from 'react'

/**
 * Sends a GA4 "affiliate_click" event for every click on a /go/<tool> link.
 * window.gtag only exists after the visitor accepts analytics cookies (components/CookieConsent.tsx),
 * so nothing is tracked without consent. Find the events in GA4 → Reports → Engagement → Events.
 */
export default function AffiliateClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="/go/"]')
      if (!link || !window.gtag) return
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
