'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { CONSENT_STORAGE_KEY as STORAGE_KEY } from '@/lib/consent'

type Choice = 'granted' | 'denied'

const OPEN_EVENT = 'tth:open-cookie-settings'

/** Re-opens the consent banner (used by the "Cookie settings" link in the footer) */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

function readChoice(): Choice | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

/** Remove Google Analytics cookies (_ga, _ga_XXXX) after consent is withdrawn */
function clearAnalyticsCookies() {
  const host = window.location.hostname
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
  document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((name) => name === '_ga' || name.startsWith('_ga_'))
    .forEach((name) =>
      domains.forEach((d) => {
        document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`
      })
    )
}

/**
 * GDPR cookie banner + consent-gated Google Analytics 4.
 *
 * Consent Mode v2 defaults (all denied) are set in <head> by lib/consent.ts. gtag.js is only
 * loaded after the visitor accepts ("basic" consent mode): nothing is sent to Google Analytics
 * before that. This banner only asks about analytics. When AdSense is enabled (`adsEnabled`),
 * Google's certified consent message (AdSense → Privacy & messaging) asks EEA/UK/Swiss visitors
 * about ad cookies separately.
 */
export default function CookieConsent({
  gaId,
  adsEnabled = false,
}: {
  gaId?: string
  adsEnabled?: boolean
}) {
  const [choice, setChoice] = useState<Choice | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const stored = readChoice()
    setChoice(stored)
    if (!stored) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, reopen)
    return () => window.removeEventListener(OPEN_EVENT, reopen)
  }, [])

  const decide = (value: Choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // Storage blocked: the choice applies to this visit only
    }
    if (value === 'denied') {
      window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
      clearAnalyticsCookies()
    } else {
      window.gtag?.('consent', 'update', { analytics_storage: 'granted' })
    }
    setChoice(value)
    setOpen(false)
  }

  if (!gaId) return null

  const loadAnalytics = choice === 'granted' && process.env.NODE_ENV === 'production'

  return (
    <>
      {loadAnalytics && (
        <>
          <Script id="ga-consent-init" strategy="afterInteractive">
            {/* Consent defaults + the "granted" update already ran in <head> (lib/consent.ts) */}
            {`window.gtag('js', new Date());
window.gtag('config', '${gaId}', { anonymize_ip: true });`}
          </Script>
          <Script
            id="ga-gtag"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
        </>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-text"
          className="fixed inset-x-3 bottom-3 z-70 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-md"
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl shadow-gray-900/20 dark:border-gray-800 dark:bg-gray-900">
            <h2
              id="cookie-consent-title"
              className="font-display text-base font-bold text-gray-900 dark:text-white"
            >
              Your privacy choices
            </h2>
            <p
              id="cookie-consent-text"
              className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400"
            >
              We&apos;d like to use Google Analytics cookies to understand which articles are
              useful. They are only set if you accept.{' '}
              {adsEnabled
                ? 'Ads are served by Google AdSense; where required, Google asks about ad cookies separately.'
                : 'We don’t use advertising cookies.'}{' '}
              You can change your choice at any time via &ldquo;Cookie settings&rdquo; in the
              footer. See our{' '}
              <Link
                href="/privacy-policy"
                className="text-primary-600 dark:text-primary-400 font-medium underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => decide('denied')}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-800"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => decide('granted')}
                className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              >
                Accept analytics
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
