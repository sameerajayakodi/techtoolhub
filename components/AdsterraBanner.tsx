'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export interface AdsterraBannerSize {
  key: string
  width: number
  height: number
}

declare global {
  interface Window {
    atOptions?: {
      key: string
      format: string
      height: number
      width: number
      params: Record<string, unknown>
    }
  }
}

/** Adsterra's banner script host, from the ad code in the Adsterra dashboard */
const SCRIPT_HOST = 'https://bicea.org/22/'

/**
 * Ad units already placed on the current page. Adsterra's terms allow each ad code once per
 * page, so a slot skips any size whose unit another slot already shows.
 */
const claimed = new Set<string>()

/**
 * Adsterra's script reads the global `atOptions` when it runs, so banners load one at a time:
 * set `atOptions`, add the script, wait for it, then the next banner.
 */
let queue: Promise<void> = Promise.resolve()

function loadBanner(container: HTMLElement, banner: AdsterraBannerSize, cancelled: () => boolean) {
  queue = queue.then(
    () =>
      new Promise<void>((resolve) => {
        if (cancelled() || !container.isConnected) return resolve()
        window.atOptions = {
          key: banner.key,
          format: 'iframe',
          height: banner.height,
          width: banner.width,
          params: {},
        }
        const script = document.createElement('script')
        script.src = `${SCRIPT_HOST}${banner.key}`
        // Give the script a moment to read atOptions before the next banner changes it
        const next = () => setTimeout(resolve, 300)
        script.onload = next
        script.onerror = next
        // Never let one slow or blocked banner hold up the others for long
        setTimeout(resolve, 8000)
        // The script places the ad next to itself, so it goes inside this slot
        container.appendChild(script)
      })
  )
}

/**
 * One Adsterra banner, placed directly in the page as Adsterra requires (their terms do not
 * allow wrapping the ad code in our own iframe).
 *
 * Shows the first of `sizes` that fits the container's width (largest first) and is not already
 * on the page, and nothing if none qualifies or the container is hidden (e.g. the sidebar on
 * mobile), so no ad loads unseen.
 */
export default function AdsterraBanner({ sizes }: { sizes: AdsterraBannerSize[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const slotRef = useRef<HTMLDivElement>(null)
  const mine = useRef<string | null>(null)
  const [banner, setBanner] = useState<AdsterraBannerSize | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const pick = () => {
      if (mine.current) claimed.delete(mine.current)
      const fit = sizes.find((s) => s.width <= el.clientWidth && !claimed.has(s.key)) ?? null
      mine.current = fit?.key ?? null
      if (fit) claimed.add(fit.key)
      setBanner((prev) => (prev?.key === fit?.key ? prev : fit))
    }
    pick()
    const observer = new ResizeObserver(pick)
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (mine.current) claimed.delete(mine.current)
      mine.current = null
    }
  }, [sizes])

  useEffect(() => {
    const slot = slotRef.current
    if (!banner || !slot) return
    let isCancelled = false
    loadBanner(slot, banner, () => isCancelled)
    return () => {
      isCancelled = true
      slot.replaceChildren()
    }
  }, [banner, pathname])

  return (
    <div ref={ref} className="flex w-full justify-center">
      {banner && (
        <div
          key={`${pathname}-${banner.key}`}
          ref={slotRef}
          style={{ width: banner.width, minHeight: banner.height }}
          className="max-w-full"
        />
      )}
    </div>
  )
}
