/**
 * Regenerates the logo, favicons and default avatar from the SVG mark below.
 * Run after changing the brand colours:  node scripts/generate-brand-assets.mjs
 */
import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'fs'

const mark = (size, radius = 8) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6366F1"/><stop offset="1" stop-color="#06B6D4"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="${radius}" fill="url(#g)"/>
  <path d="M9 11h14M16 11v11" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="9" cy="11" r="2.2" fill="#fff"/><circle cx="23" cy="11" r="2.2" fill="#fff"/>
  <circle cx="16" cy="22.5" r="2.6" fill="#fff"/>
</svg>`

const avatar = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="a" x1="0" y1="0" x2="256" y2="256" gradientUnits="userSpaceOnUse">
      <stop stop-color="#4F46E5"/><stop offset="1" stop-color="#0891B2"/>
    </linearGradient>
  </defs>
  <circle cx="128" cy="128" r="128" fill="url(#a)"/>
  <text x="128" y="152" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="88" font-weight="700" fill="#fff">TH</text>
</svg>`

const png = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer()

/** Minimal .ico containing PNG images (supported by every modern browser) */
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = header.length
  images.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i
    header.writeUInt8(size >= 256 ? 0 : size, e)
    header.writeUInt8(size >= 256 ? 0 : size, e + 1)
    header.writeUInt16LE(1, e + 4)
    header.writeUInt16LE(32, e + 6)
    header.writeUInt32LE(data.length, e + 8)
    header.writeUInt32LE(offset, e + 12)
    offset += data.length
  })
  return Buffer.concat([header, ...images.map((i) => i.data)])
}

mkdirSync('public/static/favicons', { recursive: true })
mkdirSync('public/static/images', { recursive: true })

const out = {
  'public/static/images/logo.png': await png(mark(512, 7), 512),
  'public/static/images/avatar.png': await png(avatar, 256),
  'public/static/favicons/favicon-16x16.png': await png(mark(16), 16),
  'public/static/favicons/favicon-32x32.png': await png(mark(32), 32),
  'public/static/favicons/apple-touch-icon.png': await png(mark(180, 0), 180),
  'public/static/favicons/android-chrome-192x192.png': await png(mark(192), 192),
  'public/static/favicons/android-chrome-512x512.png': await png(mark(512), 512),
}
for (const [file, data] of Object.entries(out)) writeFileSync(file, data)

writeFileSync(
  'public/favicon.ico',
  ico([
    { size: 16, data: out['public/static/favicons/favicon-16x16.png'] },
    { size: 32, data: out['public/static/favicons/favicon-32x32.png'] },
    { size: 48, data: await png(mark(48), 48) },
  ])
)

writeFileSync(
  'public/static/favicons/site.webmanifest',
  JSON.stringify(
    {
      name: 'TechToolHub',
      short_name: 'TechToolHub',
      icons: [
        { src: '/static/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/static/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: '#4f46e5',
      background_color: '#ffffff',
      display: 'standalone',
    },
    null,
    2
  ) + '\n'
)

console.log('Brand assets generated.')
