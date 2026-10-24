import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import path from 'path'
import siteMetadata from '@/data/siteMetadata'

export const ogSize = { width: 1200, height: 630 }

const gradients: Record<string, [string, string]> = {
  'ai-tools': ['#8b5cf6', '#ec4899'],
  'developer-tools': ['#0ea5e9', '#14b8a6'],
  productivity: ['#10b981', '#84cc16'],
  default: ['#6366f1', '#06b6d4'],
}

let fonts: Promise<{ name: string; data: Buffer; weight: 500 | 700; style: 'normal' }[]> | undefined

function loadFonts() {
  fonts ??= Promise.all([
    readFile(path.join(process.cwd(), 'assets/fonts/space-grotesk-latin-700-normal.woff')),
    readFile(path.join(process.cwd(), 'assets/fonts/inter-latin-500-normal.woff')),
  ]).then(([display, body]) => [
    { name: 'Space Grotesk', data: display, weight: 700, style: 'normal' },
    { name: 'Inter', data: body, weight: 500, style: 'normal' },
  ])
  return fonts
}

interface OgOptions {
  title: string
  eyebrow?: string
  category?: string
  rating?: number
  footer?: string
}

/** Branded 1200×630 social card rendered at build time with next/og */
export async function renderOgImage({ title, eyebrow, category, rating, footer }: OgOptions) {
  const [from, to] = gradients[category ?? 'default'] ?? gradients.default
  const fontSize = title.length > 80 ? 54 : title.length > 50 ? 64 : 76
  const host = siteMetadata.siteUrl.replace(/^https?:\/\//, '')

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        backgroundColor: '#0b0f1a',
        backgroundImage: `radial-gradient(circle at 85% 10%, ${from}55 0%, transparent 45%), radial-gradient(circle at 10% 110%, ${to}44 0%, transparent 50%)`,
        color: 'white',
        fontFamily: 'Inter',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: 'linear-gradient(135deg, #6366F1, #06B6D4)',
            }}
          >
            <svg width="40" height="40" viewBox="0 0 32 32">
              <path
                d="M9 11h14M16 11v11"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="9" cy="11" r="2.2" fill="#fff" />
              <circle cx="23" cy="11" r="2.2" fill="#fff" />
              <circle cx="16" cy="22.5" r="2.6" fill="#fff" />
            </svg>
          </div>
          <div style={{ display: 'flex', fontFamily: 'Space Grotesk', fontSize: 34 }}>
            TechTool<span style={{ color: '#a5b4fc' }}>Hub</span>
          </div>
        </div>
        {eyebrow && (
          <div
            style={{
              display: 'flex',
              padding: '10px 22px',
              borderRadius: 999,
              backgroundImage: `linear-gradient(90deg, ${from}, ${to})`,
              fontSize: 24,
            }}
          >
            {eyebrow}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          fontFamily: 'Space Grotesk',
          fontSize,
          lineHeight: 1.08,
          letterSpacing: -1.5,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 26,
          color: '#cbd5e1',
        }}
      >
        <div style={{ display: 'flex' }}>{footer ?? host}</div>
        {typeof rating === 'number' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} width="34" height="34" viewBox="0 0 20 20">
                  <path
                    d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z"
                    fill={i < Math.round(rating) ? '#fbbf24' : '#475569'}
                  />
                </svg>
              ))}
            </div>
            <div
              style={{ display: 'flex', fontFamily: 'Space Grotesk', fontSize: 40, color: 'white' }}
            >
              {rating.toFixed(1)}
              <span style={{ fontSize: 26, color: '#94a3b8', marginLeft: 6, marginTop: 12 }}>
                /5
              </span>
            </div>
          </div>
        )}
      </div>
    </div>,
    { ...ogSize, fonts: await loadFonts() }
  )
}
