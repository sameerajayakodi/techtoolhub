'use client'

import { openCookieSettings } from './CookieConsent'

export default function CookieSettingsButton({ className = '' }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie settings
    </button>
  )
}
