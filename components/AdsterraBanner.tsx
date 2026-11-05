'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export interface AdsterraBannerSize {
  key: string
  width: number
  height: number
}

/**
 * One Adsterra banner in a sandboxed iframe (public/ads/banner.html), so its global
 * `atOptions` and scripts can't clash with other banners or touch the page.
 *
 * Shows the first of `sizes` that fits the container's width (largest first), and nothing if
 * none fits or the container is hidden (e.g. the sidebar on mobile), so no ad loads unseen.
 */
export default function AdsterraBanner({ sizes }: { sizes: AdsterraBannerSize[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [banner, setBanner] = useState<AdsterraBannerSize | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const pick = () => {
      const fit = sizes.find((s) => s.width <= el.clientWidth) ?? null
      setBanner((prev) => (prev?.key === fit?.key ? prev : fit))
    }
    pick()
    const observer = new ResizeObserver(pick)
    observer.observe(el)
    return () => observer.disconnect()
  }, [sizes])

  return (
    <div ref={ref} className="flex w-full justify-center">
      {banner && (
        <iframe
          key={`${pathname}-${banner.key}`}
          src={`/ads/banner.html?k=${banner.key}&w=${banner.width}&h=${banner.height}`}
          width={banner.width}
          height={banner.height}
          title="Advertisement"
          loading="lazy"
          scrolling="no"
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          className="block max-w-full border-0"
        />
      )}
    </div>
  )
}
