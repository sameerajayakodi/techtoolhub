/**
 * Generates the site's original illustrations (article covers, inline diagrams, home hero, About image)
 * from hand-written SVG, rendered locally to WebP with sharp. No external services or stock photos.
 *
 *   node scripts/generate-images.mjs            # all images
 *   node scripts/generate-images.mjs hero       # only images whose name contains "hero"
 *
 * Output: public/static/images/** (committed to the repo, served by Next.js / Vercel).
 */
import sharp from 'sharp'
import { mkdirSync } from 'fs'
import path from 'path'

const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
const MONO = "Consolas, 'Cascadia Mono', 'Courier New', monospace"

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg1: '#0b1020',
  bg2: '#121a33',
  card: '#151d36',
  card2: '#1b2544',
  line: '#2a3558',
  text: '#e2e8f0',
  muted: '#94a3b8',
  dim: '#475569',
  indigo: '#6366f1',
  cyan: '#06b6d4',
  violet: '#8b5cf6',
  pink: '#ec4899',
  sky: '#0ea5e9',
  teal: '#14b8a6',
  emerald: '#10b981',
  lime: '#84cc16',
  amber: '#f59e0b',
  orange: '#f97316',
  blue: '#3b82f6',
  rose: '#f43f5e',
  yellow: '#facc15',
}

// ── SVG helpers ───────────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function frame(w, h, body, { glows = [], grid = true, bg = [C.bg1, C.bg2] } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/>
    </linearGradient>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.3" fill="#ffffff" fill-opacity="0.07"/>
    </pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000" flood-opacity="0.45"/>
    </filter>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.35"/>
    </filter>
    <filter id="blur" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="90"/></filter>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.indigo}"/><stop offset="1" stop-color="${C.cyan}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${glows.map(([x, y, r, c, o = 0.5]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" fill-opacity="${o}" filter="url(#blur)"/>`).join('')}
  ${grid ? `<rect width="${w}" height="${h}" fill="url(#dots)"/>` : ''}
  ${body}
</svg>`
}

const rect = (x, y, w, h, fill, rx = 0, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`

const text = (
  x,
  y,
  s,
  { size = 24, fill = C.text, weight = 600, anchor = 'start', font = FONT, extra = '' } = {}
) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" ${extra}>${esc(s)}</text>`

/** A rounded "app window" card with traffic-light dots and an optional title */
function windowCard(
  x,
  y,
  w,
  h,
  {
    title = '',
    accent = C.indigo,
    fill = C.card,
    header = 56,
    titleColor = C.text,
    lineColor = C.line,
  } = {}
) {
  return `<g filter="url(#shadow)">
    ${rect(x, y, w, h, fill, 24, `stroke="${lineColor}" stroke-width="2"`)}
  </g>
  <path d="M${x} ${y + header} H${x + w}" stroke="${lineColor}" stroke-width="2"/>
  <circle cx="${x + 28}" cy="${y + header / 2}" r="7" fill="#f87171"/>
  <circle cx="${x + 52}" cy="${y + header / 2}" r="7" fill="#fbbf24"/>
  <circle cx="${x + 76}" cy="${y + header / 2}" r="7" fill="#34d399"/>
  ${title ? `<circle cx="${x + 110}" cy="${y + header / 2}" r="6" fill="${accent}"/>${text(x + 126, y + header / 2 + 8, title, { size: 22, weight: 700, fill: titleColor })}` : ''}`
}

/** Horizontal "text line" placeholders */
const lines = (x, y, widths, { gap = 22, h = 10, fill = C.dim, op = 1 } = {}) =>
  widths.map((w, i) => rect(x, y + i * gap, w, h, fill, h / 2, `fill-opacity="${op}"`)).join('')

const pill = (
  x,
  y,
  label,
  { fill = '#ffffff', color = C.bg1, size = 20, padX = 18, h = 40, weight = 700 } = {}
) => {
  const w = label.length * size * 0.58 + padX * 2
  return `${rect(x, y, w, h, fill, h / 2)}${text(x + w / 2, y + h / 2 + size * 0.36, label, { size, fill: color, weight, anchor: 'middle' })}`
}

const check = (cx, cy, r = 14, fill = C.emerald) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/><path d="M${cx - r * 0.45} ${cy} l${r * 0.32} ${r * 0.32} l${r * 0.6} -${r * 0.62}" stroke="#fff" stroke-width="${r * 0.22}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`

const cross = (cx, cy, r = 14, fill = C.rose) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/><path d="M${cx - r * 0.35} ${cy - r * 0.35} l${r * 0.7} ${r * 0.7} M${cx + r * 0.35} ${cy - r * 0.35} l-${r * 0.7} ${r * 0.7}" stroke="#fff" stroke-width="${r * 0.2}" stroke-linecap="round"/>`

const star = (cx, cy, r, fill) => {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45
    const a = (Math.PI / 5) * i - Math.PI / 2
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`)
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`
}
const stars = (x, y, n, r = 12, gap = 30) =>
  Array.from({ length: 5 }, (_, i) => star(x + i * gap, y, r, i < n ? C.amber : C.dim)).join('')

function ring(cx, cy, r, value, color, { width = 14, label = true } = {}) {
  const c = 2 * Math.PI * r
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.line}" stroke-width="${width}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"
    stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c - (value / 5) * c).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>
  ${label ? text(cx, cy + r * 0.2, value.toFixed(1), { size: r * 0.62, weight: 800, anchor: 'middle' }) : ''}`
}

/** Arrow from (x1,y1) to (x2,y2) */
function arrow(x1, y1, x2, y2, color = C.muted, { width = 3, dash = '' } = {}) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const s = 14
  const p1 = [x2 - s * Math.cos(a - 0.45), y2 - s * Math.sin(a - 0.45)]
  const p2 = [x2 - s * Math.cos(a + 0.45), y2 - s * Math.sin(a + 0.45)]
  return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="${width}" ${dash ? `stroke-dasharray="${dash}"` : ''} fill="none"/>
  <polygon points="${x2},${y2} ${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}" fill="${color}"/>`
}

/** A rounded box with a heading and up to two lines of description */
function box(
  x,
  y,
  w,
  h,
  title,
  desc = [],
  { accent = C.indigo, fill = C.card, titleSize = 28 } = {}
) {
  return `<g filter="url(#soft)">${rect(x, y, w, h, fill, 20, `stroke="${C.line}" stroke-width="2"`)}</g>
  ${rect(x, y, 8, h, accent, 4)}
  ${text(x + 32, y + 50, title, { size: titleSize, weight: 700 })}
  ${desc.map((d, i) => text(x + 32, y + 88 + i * 32, d, { size: 21, fill: C.muted, weight: 500 })).join('')}`
}

// ── Images ────────────────────────────────────────────────────────────────────
function chatWindow(x, y, name, accent, seed) {
  const w = 400
  const h = 520
  const user = [210, 150][seed % 2]
  return `${windowCard(x, y, w, h, { title: name, accent })}
  ${rect(x + w - user - 64, y + 92, user + 40, 64, accent, 18, 'fill-opacity="0.22"')}
  ${lines(x + w - user - 44, y + 112, [user, user * 0.6], { fill: accent, op: 0.9 })}
  ${rect(x + 24, y + 184, 330, 168, C.card2, 18)}
  ${lines(x + 48, y + 210, [270, 240, 282, 190, 230].slice(0, 5 - (seed % 2)), { gap: 26 })}
  ${rect(x + 24, y + 372, 230, 58, C.card2, 18)}
  ${[0, 1, 2].map((i) => `<circle cx="${x + 56 + i * 26}" cy="${y + 401}" r="7" fill="${C.muted}" fill-opacity="${0.4 + i * 0.25}"/>`).join('')}
  ${rect(x + 24, y + h - 72, w - 48, 50, '#0f1529', 25, `stroke="${C.line}" stroke-width="2"`)}
  ${lines(x + 48, y + h - 52, [150], { fill: C.dim })}
  <circle cx="${x + w - 50}" cy="${y + h - 47}" r="17" fill="${accent}"/>
  <path d="M${x + w - 56} ${y + h - 47} h12 m-5 -6 l6 6 l-6 6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>`
}

const vs = (cx, cy) =>
  `<g filter="url(#soft)"><circle cx="${cx}" cy="${cy}" r="36" fill="#ffffff"/></g>${text(cx, cy + 10, 'VS', { size: 28, weight: 800, fill: C.bg1, anchor: 'middle' })}`

const images = {
  // Article covers (1600×900, 16:9) ──────────────────────────────────────────
  'blog/chatgpt-vs-claude-vs-gemini/cover': () =>
    frame(
      1600,
      900,
      `${pill(170, 92, 'AI ASSISTANTS COMPARED · 2026', { fill: 'rgba(255,255,255,0.1)', color: C.text, size: 20 })}
      ${chatWindow(170, 210, 'ChatGPT', C.emerald, 0)}
      ${chatWindow(600, 170, 'Claude', C.orange, 1)}
      ${chatWindow(1030, 210, 'Gemini', C.blue, 2)}
      ${vs(585, 470)}${vs(1015, 470)}`,
      {
        glows: [
          [1350, 120, 320, C.violet, 0.55],
          [200, 820, 300, C.pink, 0.4],
          [800, 450, 260, C.indigo, 0.25],
        ],
      }
    ),

  'blog/best-ai-coding-assistants/cover': () => {
    const ex = 230
    const ey = 140
    const tok = (x, y, parts) => {
      let cx = x
      return parts
        .map(([w, c]) => {
          const r = rect(cx, y, w, 14, c, 7)
          cx += w + 12
          return r
        })
        .join('')
    }
    const code = [
      [
        [70, C.violet],
        [120, C.sky],
        [40, C.muted],
      ],
      [
        [40, C.dim],
        [90, C.violet],
        [160, C.emerald],
      ],
      [
        [40, C.dim],
        [60, C.violet],
        [110, C.sky],
        [80, C.amber],
      ],
      [
        [40, C.dim],
        [40, C.dim],
        [180, C.text],
        [70, C.emerald],
      ],
      [
        [40, C.dim],
        [130, C.sky],
        [60, C.muted],
      ],
      [
        [60, C.violet],
        [90, C.amber],
      ],
      [],
    ]
    return frame(
      1600,
      900,
      `${windowCard(ex, ey, 1140, 640, { title: 'agent.ts', accent: C.sky })}
      ${rect(ex + 2, ey + 58, 66, 580, '#121931')}
      ${[...code, 0, 0].map((_, i) => text(ex + 46, ey + 106 + i * 40, String(i + 1), { size: 16, fill: C.dim, anchor: 'end', font: MONO, weight: 400 })).join('')}
      ${code.map((parts, i) => tok(ex + 96, ey + 94 + i * 40, parts)).join('')}
      ${rect(ex + 88, ey + 374, 610, 76, C.sky, 10, 'fill-opacity="0.10" stroke="#38bdf8" stroke-opacity="0.5" stroke-dasharray="8 6" stroke-width="2"')}
      ${tok(ex + 108, ey + 390, [
        [60, '#38bdf8'],
        [150, '#7dd3fc'],
        [90, '#38bdf8'],
      ])}
      ${tok(ex + 108, ey + 420, [
        [40, '#38bdf8'],
        [200, '#7dd3fc'],
      ])}
      ${pill(ex + 560, ey + 342, 'Tab to accept', { fill: C.sky, color: '#fff', size: 16, h: 30, padX: 12 })}
      ${rect(ex + 2, ey + 500, 760, 138, '#0c1224', 0)}
      <path d="M${ex} ${ey + 500} H${ex + 762}" stroke="${C.line}" stroke-width="2"/>
      ${text(ex + 30, ey + 545, '$ npm test', { size: 22, font: MONO, fill: C.muted, weight: 400 })}
      ${check(ex + 42, ey + 578, 11)}${text(ex + 64, ey + 585, '48 passed  ·  0 failed', { size: 22, font: MONO, fill: '#34d399', weight: 400 })}
      ${rect(ex + 762, ey + 58, 376, 580, '#111830')}
      <path d="M${ex + 762} ${ey + 58} V${ey + 638}" stroke="${C.line}" stroke-width="2"/>
      ${text(ex + 792, ey + 110, 'AI agent', { size: 24, weight: 700 })}
      ${pill(ex + 960, ey + 84, 'Working', { fill: 'rgba(16,185,129,0.18)', color: '#34d399', size: 15, h: 32, padX: 12 })}
      ${['Read 12 files', 'Plan the change', 'Edit 4 files', 'Run the tests', 'Open pull request']
        .map(
          (s, i) =>
            `${i < 4 ? check(ex + 806, ey + 168 + i * 66, 14) : `<circle cx="${ex + 806}" cy="${ey + 168 + i * 66}" r="14" fill="none" stroke="${C.sky}" stroke-width="3" stroke-dasharray="6 5"/>`}
            ${text(ex + 834, ey + 176 + i * 66, s, { size: 21, fill: i < 4 ? C.text : C.muted, weight: 500 })}`
        )
        .join('')}
      ${rect(ex + 792, ey + 520, 316, 10, C.line, 5)}${rect(ex + 792, ey + 520, 250, 10, 'url(#brand)', 5)}
      ${text(ex + 792, ey + 570, '80% complete', { size: 18, fill: C.muted, weight: 500 })}
      <g filter="url(#soft)">${pill(1230, 70, '6 tools compared', { fill: '#ffffff', color: C.bg1, size: 22, h: 48 })}</g>`,
      {
        glows: [
          [1400, 150, 320, C.sky, 0.5],
          [150, 800, 300, C.teal, 0.45],
        ],
      }
    )
  },

  'blog/best-note-taking-apps/cover': () => {
    const node = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`
    const nodes = [
      [1250, 300, 18, C.emerald],
      [1150, 220, 11, C.lime],
      [1370, 230, 12, C.teal],
      [1340, 400, 14, C.lime],
      [1160, 410, 12, C.teal],
      [1260, 520, 11, C.emerald],
      [1420, 330, 9, C.muted],
      [1100, 320, 9, C.muted],
    ]
    const edges = [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [3, 5],
      [4, 5],
      [2, 6],
      [1, 7],
      [3, 6],
    ]
    return frame(
      1600,
      900,
      `<g transform="rotate(-5 380 470)">
        ${windowCard(170, 210, 420, 500, { title: 'Today', accent: C.amber, fill: '#f8fafc', titleColor: '#0f172a', lineColor: '#e2e8f0' })}
        ${lines(206, 300, [300, 250, 280], { fill: '#cbd5e1', gap: 28 })}
        ${[0, 1, 2].map((i) => `${i < 2 ? check(222, 420 + i * 62, 16) : `<rect x="206" y="${404 + i * 62}" width="32" height="32" rx="8" fill="none" stroke="#94a3b8" stroke-width="3"/>`}${rect(256, 412 + i * 62, [220, 180, 240][i], 14, '#cbd5e1', 7)}`).join('')}
      </g>
      ${windowCard(560, 160, 520, 600, { title: 'Projects', accent: C.emerald })}
      ${[
        ['Website relaunch', C.emerald, 'Doing'],
        ['Q4 content plan', C.sky, 'Next'],
        ['Reading notes', C.violet, 'Ideas'],
        ['Team wiki', C.amber, 'Done'],
        ['Course outline', C.pink, 'Next'],
      ]
        .map(
          ([t, c, s], i) => `${rect(588, 246 + i * 96, 464, 74, C.card2, 14)}
          ${rect(608, 270 + i * 96, 26, 26, c, 7)}
          ${text(652, 291 + i * 96, t, { size: 22, weight: 600 })}
          ${pill(940, 263 + i * 96, s, { fill: c + '33', color: c, size: 15, h: 32, padX: 12 })}`
        )
        .join('')}
      ${windowCard(1110, 150, 400, 460, { title: 'Graph', accent: C.lime })}
      <g transform="translate(60 0)">${edges.map(([a, b]) => `<path d="M${nodes[a][0]} ${nodes[a][1]} L${nodes[b][0]} ${nodes[b][1]}" stroke="${C.dim}" stroke-width="2.5"/>`).join('')}
      ${nodes.map((n) => node(...n)).join('')}</g>
      <g transform="rotate(6 1250 720)" filter="url(#soft)">
        ${rect(1130, 620, 220, 200, C.yellow, 10)}
        ${lines(1160, 670, [150, 120, 160, 90], { fill: '#a16207', op: 0.45, gap: 28 })}
      </g>
      <g transform="rotate(-8 330 760)" filter="url(#soft)">
        ${rect(230, 680, 200, 170, '#f9a8d4', 10)}
        ${lines(256, 726, [140, 110, 130], { fill: '#9d174d', op: 0.4, gap: 28 })}
      </g>`,
      {
        glows: [
          [1400, 140, 320, C.emerald, 0.45],
          [180, 780, 300, C.lime, 0.35],
        ],
      }
    )
  },

  // Inline diagrams (1600×900) ───────────────────────────────────────────────
  'blog/chatgpt-vs-claude-vs-gemini/which-ai-assistant-flowchart': () =>
    frame(
      1600,
      900,
      `${text(800, 90, 'Which AI assistant should you choose?', { size: 44, weight: 800, anchor: 'middle' })}
      ${box(500, 140, 600, 120, 'What will you use AI for most?', ['Start here and follow your main use case'], { accent: C.indigo })}
      ${arrow(800, 260, 300, 400, C.muted)}${arrow(800, 260, 800, 400, C.muted)}${arrow(800, 260, 1300, 400, C.muted)}
      ${box(80, 410, 440, 150, 'Writing, analysis & code', ['Long documents, research,', 'refactoring and debugging'], { accent: C.orange, titleSize: 26 })}
      ${box(580, 410, 440, 150, 'A bit of everything', ['Chat, images, voice, agents', 'and coding in one app'], { accent: C.emerald, titleSize: 26 })}
      ${box(1080, 410, 440, 150, 'Gmail, Docs & Drive daily', ['You already live in', "Google's apps"], { accent: C.blue, titleSize: 26 })}
      ${arrow(300, 560, 300, 650, C.orange)}${arrow(800, 560, 800, 650, C.emerald)}${arrow(1300, 560, 1300, 650, C.blue)}
      ${[
        [80, 'Claude', 'Pro · $20/mo ($17 yearly)', C.orange],
        [580, 'ChatGPT', 'Plus · $20/mo (Go · $8)', C.emerald],
        [1080, 'Gemini', 'Google AI Pro · $19.99/mo', C.blue],
      ]
        .map(
          ([x, n, p, c]) => `<g filter="url(#soft)">${rect(x, 660, 440, 140, c, 22)}</g>
          ${text(x + 220, 722, n, { size: 40, weight: 800, anchor: 'middle', fill: '#fff' })}
          ${text(x + 220, 766, p, { size: 22, weight: 600, anchor: 'middle', fill: '#ffffff', extra: 'fill-opacity="0.9"' })}`
        )
        .join('')}
      ${text(800, 860, 'Prices checked October 2026 · techtoolhub', { size: 18, fill: C.dim, weight: 500, anchor: 'middle' })}`,
      {
        glows: [
          [1400, 100, 260, C.violet, 0.3],
          [150, 850, 260, C.pink, 0.25],
        ],
      }
    ),

  'blog/best-ai-coding-assistants/agent-vs-editor': () => {
    const step = (x, y, w, label, c) =>
      `<g filter="url(#soft)">${rect(x, y, w, 96, C.card, 18, `stroke="${c}" stroke-opacity="0.6" stroke-width="2"`)}</g>${text(x + w / 2, y + 56, label, { size: 22, weight: 600, anchor: 'middle' })}`
    return frame(
      1600,
      900,
      `${text(800, 90, 'AI code editor vs coding agent', { size: 44, weight: 800, anchor: 'middle' })}
      ${pill(80, 170, 'AI CODE EDITOR', { fill: C.sky, color: '#fff', size: 18 })}
      ${text(330, 198, 'e.g. Cursor, GitHub Copilot  ·  you stay in control', { size: 22, fill: C.muted, weight: 500 })}
      ${step(80, 240, 300, 'You type code', C.sky)}${arrow(390, 288, 450, 288, C.sky)}
      ${step(460, 240, 300, 'AI suggests lines', C.sky)}${arrow(770, 288, 830, 288, C.sky)}
      ${step(840, 240, 300, 'You accept or edit', C.sky)}
      <path d="M1150 288 C1260 288 1260 400 990 400 C 600 400 300 400 230 345" stroke="${C.sky}" stroke-width="3" fill="none" stroke-dasharray="8 8"/>
      ${arrow(236, 352, 230, 345, C.sky)}
      ${text(720, 440, 'repeat', { size: 20, fill: C.sky, weight: 600, anchor: 'middle' })}
      ${pill(80, 500, 'CODING AGENT', { fill: C.orange, color: '#fff', size: 18 })}
      ${text(310, 528, 'e.g. Claude Code, OpenAI Codex  ·  it does the work, you review', { size: 22, fill: C.muted, weight: 500 })}
      ${step(80, 580, 250, 'Describe the task', C.orange)}${arrow(336, 628, 366, 628, C.orange)}
      ${step(372, 580, 250, 'Agent plans', C.orange)}${arrow(628, 628, 658, 628, C.orange)}
      ${step(664, 580, 250, 'Edits files', C.orange)}${arrow(920, 628, 950, 628, C.orange)}
      ${step(956, 580, 250, 'Runs tests', C.orange)}${arrow(1212, 628, 1242, 628, C.orange)}
      ${step(1248, 580, 272, 'Opens a PR', C.orange)}
      ${check(1490, 600, 16)}
      ${text(800, 790, 'Many developers use both: an editor for small edits, an agent for bigger tasks.', { size: 24, fill: C.text, weight: 500, anchor: 'middle' })}
      ${text(800, 860, 'techtoolhub', { size: 18, fill: C.dim, weight: 500, anchor: 'middle' })}`,
      {
        glows: [
          [1450, 150, 260, C.sky, 0.3],
          [150, 820, 260, C.orange, 0.22],
        ],
      }
    )
  },

  'blog/best-note-taking-apps/two-app-system': () =>
    frame(
      1600,
      900,
      `${text(800, 90, 'The two-app note-taking system', { size: 44, weight: 800, anchor: 'middle' })}
      ${text(800, 140, 'Capture fast, organise later', { size: 26, fill: C.muted, weight: 500, anchor: 'middle' })}
      ${box(80, 250, 480, 300, '1. Capture', ['Google Keep or Apple Notes', '', '•  Quick ideas & to-dos', '•  Shopping lists, voice memos', '•  Takes seconds'], { accent: C.amber })}
      ${arrow(580, 400, 680, 400, C.muted, { width: 4 })}
      <g filter="url(#soft)"><circle cx="800" cy="400" r="110" fill="${C.card}" stroke="${C.emerald}" stroke-width="3"/></g>
      ${text(800, 390, '2. Review', { size: 30, weight: 700, anchor: 'middle' })}
      ${text(800, 428, '15 min / week', { size: 20, fill: C.muted, weight: 500, anchor: 'middle' })}
      ${arrow(920, 400, 1020, 400, C.muted, { width: 4 })}
      ${box(1040, 250, 480, 300, '3. Organise', ['Notion or Obsidian', '', '•  Projects & tasks', '•  Knowledge base, linked notes', '•  Long-form docs'], { accent: C.emerald })}
      ${rect(80, 650, 1440, 120, C.card2, 22)}
      ${text(800, 703, 'Tip: keep the capture app on your home screen and move anything', { size: 24, weight: 500, anchor: 'middle' })}
      ${text(800, 741, 'worth keeping into your main app during a weekly review.', { size: 24, weight: 500, anchor: 'middle' })}
      ${text(800, 860, 'techtoolhub', { size: 18, fill: C.dim, weight: 500, anchor: 'middle' })}`,
      {
        glows: [
          [1450, 120, 260, C.emerald, 0.3],
          [150, 820, 260, C.lime, 0.22],
        ],
      }
    ),

  // November 2026 trending articles ─────────────────────────────────────────
  'blog/gpt-6-chatgpt-whats-new/cover': () =>
    frame(
      1600,
      900,
      `${pill(150, 80, 'GPT-6 · INTELLIGENT UI', { fill: 'rgba(255,255,255,0.1)', color: C.text, size: 20 })}
      ${windowCard(150, 160, 1300, 660, { title: 'ChatGPT', accent: C.emerald })}
      ${rect(1050, 250, 360, 64, C.emerald, 18, 'fill-opacity="0.22"')}
      ${lines(1076, 268, [300, 190], { fill: C.emerald, op: 0.9 })}
      <g filter="url(#soft)">${rect(200, 350, 560, 420, C.card2, 22, `stroke="${C.line}" stroke-width="2"`)}</g>
      ${text(232, 400, 'Price vs features', { size: 24, weight: 700 })}
      ${[0.45, 0.7, 0.55, 0.9, 0.8].map((v, i) => rect(250 + i * 96, 720 - v * 260, 60, v * 260, [C.emerald, C.teal, C.sky, C.emerald, C.lime][i], 10)).join('')}
      <path d="M232 722 H730" stroke="${C.line}" stroke-width="2"/>
      <g filter="url(#soft)">${rect(800, 350, 610, 200, C.card2, 22, `stroke="${C.line}" stroke-width="2"`)}</g>
      ${text(832, 398, 'Plan your trip', { size: 24, weight: 700 })}
      <path d="M840 500 C 920 430 1000 520 1080 450 S 1240 470 1360 420" stroke="${C.sky}" stroke-width="5" fill="none" stroke-dasharray="2 12" stroke-linecap="round"/>
      <circle cx="840" cy="500" r="12" fill="${C.emerald}"/><circle cx="1360" cy="420" r="12" fill="${C.rose}"/>
      <g filter="url(#soft)">${rect(800, 580, 610, 190, C.card2, 22, `stroke="${C.line}" stroke-width="2"`)}</g>
      ${text(832, 628, 'Quick actions', { size: 24, weight: 700 })}
      ${['Compare', 'Book', 'Save'].map((b, i) => `${rect(832 + i * 190, 660, 170, 64, i === 0 ? C.emerald : '#0f1529', 16, i === 0 ? '' : `stroke="${C.line}" stroke-width="2"`)}${text(917 + i * 190, 701, b, { size: 22, weight: 700, anchor: 'middle', fill: i === 0 ? '#04291d' : C.text })}`).join('')}`,
      {
        glows: [
          [1400, 120, 320, C.emerald, 0.45],
          [200, 820, 300, C.teal, 0.35],
        ],
      }
    ),

  'blog/chatgpt-images-2-6/cover': () =>
    frame(
      1600,
      900,
      `${pill(150, 80, 'CHATGPT IMAGES 2.6 · GIFS', { fill: 'rgba(255,255,255,0.1)', color: C.text, size: 20 })}
      ${windowCard(150, 160, 1300, 660, { title: 'ChatGPT Images', accent: C.pink })}
      ${[0, 1, 2, 3]
        .map((i) => {
          const x = 210 + i * 300
          const cy = [470, 360, 330, 420][i]
          return `<g filter="url(#soft)">${rect(x, 250, 270, 300, C.card2, 22, `stroke="${C.line}" stroke-width="2"`)}</g>
          <path d="M${x + 30} 520 H${x + 240}" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>
          <ellipse cx="${x + 135}" cy="${cy}" rx="${i === 0 ? 56 : 46}" ry="${i === 0 ? 36 : 46}" fill="${C.pink}" fill-opacity="${[0.4, 0.6, 0.8, 1][i]}"/>
          ${text(x + 135, 586, `Frame ${i + 1}`, { size: 20, weight: 600, anchor: 'middle', fill: C.muted })}`
        })
        .join('')}
      ${rect(210, 640, 1170, 14, C.line, 7)}
      ${rect(210, 640, 640, 14, C.pink, 7)}
      <circle cx="850" cy="647" r="20" fill="#fff"/>
      ${text(210, 700, 'Speed', { size: 22, weight: 600, fill: C.muted })}
      ${pill(210, 730, 'Flare · fast', { fill: C.pink + '33', color: C.pink, size: 18, h: 40, padX: 16 })}
      ${pill(390, 730, 'Sunburst · detailed', { fill: C.violet + '33', color: C.violet, size: 18, h: 40, padX: 16 })}
      ${[C.sky, C.amber, C.emerald]
        .map((c, i) => `<circle cx="${1130 + i * 90}" cy="750" r="30" fill="${c}"/>`)
        .join('')}
      ${text(1130, 710, 'Saved references', { size: 20, weight: 600, fill: C.muted })}`,
      {
        glows: [
          [1400, 120, 320, C.pink, 0.4],
          [200, 820, 300, C.violet, 0.35],
        ],
      }
    ),

  'blog/best-second-hand-iphone-sri-lanka/cover': () =>
    frame(
      1600,
      900,
      `${pill(150, 80, 'USED IPHONE GUIDE · SRI LANKA', { fill: 'rgba(255,255,255,0.1)', color: C.text, size: 20 })}
      ${[
        ['11', 250, 250, C.sky],
        ['12', 650, 170, C.amber],
        ['13', 1050, 250, C.violet],
      ]
        .map(([label, x, y, c], i) => {
          const w = 300
          const h = 520
          const hi = i === 1
          return `<g filter="url(#shadow)">${rect(x, y, w, h, C.card2, 56, `stroke="${hi ? c : C.line}" stroke-width="${hi ? 5 : 3}"`)}</g>
          ${rect(x + 18, y + 18, w - 36, h - 36, C.card, 40)}
          ${rect(x + w / 2 - 50, y + 32, 100, 28, C.bg1, 14)}
          <circle cx="${x + w / 2}" cy="${y + 250}" r="92" fill="${c}" fill-opacity="${hi ? 0.95 : 0.25}"/>
          ${text(x + w / 2, y + 277, label, { size: 84, weight: 800, anchor: 'middle', fill: hi ? C.bg1 : c })}
          ${rect(x + 70, y + h - 120, w - 140, 12, C.line, 6)}
          ${rect(x + 70, y + h - 90, w - 220, 12, C.line, 6)}`
        })
        .join('')}
      ${pill(655, 120, 'Best value', { fill: C.amber, color: C.bg1, size: 22, h: 44, padX: 22 })}
      ${[
        ['Activation Lock', 150],
        ['Battery health', 530],
        ['IMEI', 900],
      ]
        .map(
          ([label, x]) =>
            `${check(x + 22, 800, 18, C.emerald)}${text(x + 54, 808, label, { size: 26, weight: 600, fill: C.text })}`
        )
        .join('')}`,
      {
        glows: [
          [1400, 120, 320, C.amber, 0.4],
          [200, 820, 300, C.orange, 0.35],
        ],
      }
    ),

  'blog/ram-prices-2026-why-so-expensive/cover': () =>
    frame(
      1600,
      900,
      `${pill(150, 80, 'RAM PRICES · 2026', { fill: 'rgba(255,255,255,0.1)', color: C.text, size: 20 })}
      ${[0, 1, 2, 3, 4]
        .map((i) => {
          const h = 110 + i * 100
          const x = 170 + i * 120
          const hot = i === 4
          return rect(
            x,
            780 - h,
            84,
            h,
            hot ? C.rose : C.card2,
            14,
            `stroke="${hot ? C.rose : C.line}" stroke-width="2"`
          )
        })
        .join('')}
      ${arrow(190, 600, 760, 250, C.amber, { width: 9 })}
      ${text(170, 836, 'Memory prices', { size: 24, weight: 600, fill: C.muted })}
      <g filter="url(#shadow)">${rect(840, 290, 640, 270, '#14532d', 20, `stroke="${C.emerald}" stroke-width="3"`)}</g>
      ${[0, 1, 2, 3, 4, 5, 6, 7]
        .map((i) =>
          rect(
            872 + i * 76,
            330,
            58,
            108,
            '#0b1020',
            8,
            `stroke="${C.emerald}" stroke-opacity="0.6" stroke-width="2"`
          )
        )
        .join('')}
      ${text(872, 490, 'DRAM', { size: 40, weight: 800, fill: '#bbf7d0' })}
      ${Array.from({ length: 22 }, (_, i) => rect(868 + i * 27, 532, 15, 28, C.yellow, 2)).join('')}
      ${pill(840, 620, 'AI demand', { fill: C.pink + '33', color: C.pink, size: 24, h: 52, padX: 22 })}
      ${pill(1090, 620, 'Supply tight', { fill: C.amber + '33', color: C.amber, size: 24, h: 52, padX: 22 })}
      ${pill(1380, 620, 'Prices up', { fill: C.rose + '33', color: C.rose, size: 24, h: 52, padX: 22 })}`,
      {
        glows: [
          [1400, 140, 320, C.rose, 0.35],
          [220, 800, 300, C.amber, 0.3],
        ],
      }
    ),

  'blog/iran-war-tech-prices-2026/cover': () =>
    frame(
      1600,
      900,
      `${pill(150, 80, 'IRAN WAR · TECH PRICES', { fill: 'rgba(255,255,255,0.1)', color: C.text, size: 20 })}
      <path d="M150 250 H1450 V380 H1010 L920 470 H680 L590 380 H150 Z" fill="${C.card2}" stroke="${C.line}" stroke-width="3"/>
      <path d="M150 680 H1450 V560 H1010 L920 560 H680 L590 560 H150 Z" fill="${C.card2}" stroke="${C.line}" stroke-width="3"/>
      <path d="M150 560 H590 L680 560 H920 H1010 H1450 V680 H150 Z" fill="${C.card2}" stroke="${C.line}" stroke-width="3"/>
      ${[
        [250, 500],
        [1100, 505],
      ]
        .map(
          ([x, y]) => `<path d="M${x} ${y} h210 l-24 38 h-162 z" fill="${C.sky}"/>
          ${[0, 1, 2].map((k) => rect(x + 14 + k * 62, y - 34, 54, 34, [C.amber, C.pink, C.teal][k], 4)).join('')}`
        )
        .join('')}
      <path d="M800 400 V540" stroke="${C.rose}" stroke-width="6" stroke-dasharray="14 12" stroke-linecap="round"/>
      <path d="M800 430 l30 52 h-60 z" fill="${C.amber}"/>
      ${text(800, 474, '!', { size: 30, weight: 800, anchor: 'middle', fill: C.bg1 })}
      ${text(800, 600, 'Strait of Hormuz', { size: 24, weight: 600, anchor: 'middle', fill: C.muted })}
      ${pill(250, 740, 'Helium', { fill: C.violet + '33', color: C.violet, size: 26, h: 56, padX: 26 })}
      ${pill(450, 740, 'Circuit-board materials', { fill: C.teal + '33', color: C.teal, size: 26, h: 56, padX: 26 })}
      ${pill(910, 740, 'Freight', { fill: C.sky + '33', color: C.sky, size: 26, h: 56, padX: 26 })}
      ${rect(1180, 725, 90, 90, C.card2, 16, `stroke="${C.amber}" stroke-width="3"`)}
      ${rect(1203, 748, 44, 44, C.amber, 8)}
      ${text(1300, 786, 'Prices?', { size: 30, weight: 700, fill: C.text })}`,
      {
        glows: [
          [1400, 120, 320, C.amber, 0.3],
          [200, 820, 300, C.sky, 0.3],
        ],
      }
    ),

  'blog/world-war-3-technology-iran-war/cover': () =>
    frame(
      1600,
      900,
      `${pill(150, 80, 'WAR AND TECH · WHAT IS REAL', { fill: 'rgba(255,255,255,0.1)', color: C.text, size: 20 })}
      <circle cx="800" cy="470" r="230" fill="${C.card}" stroke="${C.line}" stroke-width="3"/>
      <ellipse cx="800" cy="470" rx="230" ry="80" fill="none" stroke="${C.line}" stroke-width="2"/>
      <ellipse cx="800" cy="470" rx="100" ry="230" fill="none" stroke="${C.line}" stroke-width="2"/>
      <path d="M800 240 V700 M570 470 H1030" stroke="${C.line}" stroke-width="2"/>
      ${[
        [420, 330],
        [1180, 320],
        [380, 640],
        [1230, 620],
      ]
        .map(
          ([x, y]) =>
            `<path d="M${x} ${y} L800 470" stroke="${C.sky}" stroke-opacity="0.5" stroke-width="3"/><circle cx="${x}" cy="${y}" r="20" fill="${C.sky}"/>`
        )
        .join('')}
      <path d="M1230 620 L800 470" stroke="${C.rose}" stroke-width="4" stroke-dasharray="12 12"/>
      <circle cx="1230" cy="620" r="20" fill="${C.rose}"/>
      <circle cx="800" cy="470" r="64" fill="none" stroke="${C.amber}" stroke-opacity="0.35" stroke-width="4"/>
      <circle cx="800" cy="470" r="110" fill="none" stroke="${C.amber}" stroke-opacity="0.2" stroke-width="4"/>
      <path d="M800 520 s-40 -50 -40 -76 a40 40 0 0 1 80 0 c0 26 -40 76 -40 76z" fill="${C.amber}"/>
      <circle cx="800" cy="444" r="14" fill="${C.bg1}"/>
      ${text(1230, 676, 'Cable cut?', { size: 22, weight: 600, anchor: 'middle', fill: C.rose })}
      ${[
        ['GPS', 150, C.amber],
        ['Internet', 330, C.sky],
        ['Data centres', 560, C.violet],
        ['Undersea cables', 860, C.teal],
      ]
        .map(([label, x, c]) =>
          pill(x, 800, label, { fill: c + '33', color: c, size: 26, h: 56, padX: 26 })
        )
        .join('')}`,
      {
        glows: [
          [1400, 120, 320, C.sky, 0.3],
          [200, 800, 300, C.amber, 0.3],
        ],
      }
    ),

  'blog/receive-freelance-payments-sri-lanka/cover': () =>
    frame(
      1600,
      900,
      `${pill(150, 80, 'FREELANCE PAYMENTS · SRI LANKA', { fill: 'rgba(255,255,255,0.1)', color: C.text, size: 20 })}
      ${[
        ['$', 'Client abroad', 150, C.sky],
        ['%', 'PayPal · Payoneer · Swift', 600, C.amber],
        ['Rs', 'Your bank', 1050, C.emerald],
      ]
        .map(([sym, label, x, c], i) => {
          const w = 400
          const h = 400
          const y = 230
          const hi = i === 2
          return `<g filter="url(#shadow)">${rect(x, y, w, h, C.card2, 40, `stroke="${hi ? c : C.line}" stroke-width="${hi ? 5 : 3}"`)}</g>
          <circle cx="${x + w / 2}" cy="${y + 165}" r="96" fill="${c}" fill-opacity="${hi ? 0.95 : 0.25}"/>
          ${text(x + w / 2, y + 165 + (sym === 'Rs' ? 26 : 30), sym, { size: sym === 'Rs' ? 72 : 88, weight: 800, anchor: 'middle', fill: hi ? C.bg1 : c })}
          ${text(x + w / 2, y + 330, label, { size: label.length > 16 ? 26 : 32, weight: 700, anchor: 'middle', fill: C.text })}`
        })
        .join('')}
      ${arrow(560, 430, 596, 430, C.muted, { width: 5 })}
      ${arrow(1010, 430, 1046, 430, C.muted, { width: 5 })}
      ${[
        ['Fees per route', 150],
        ['PayPal partner banks', 520],
        ['15% tax rule', 990],
      ]
        .map(
          ([label, x]) =>
            `${check(x + 22, 760, 18, C.emerald)}${text(x + 54, 768, label, { size: 28, weight: 600, fill: C.text })}`
        )
        .join('')}`,
      {
        glows: [
          [1400, 120, 320, C.emerald, 0.35],
          [200, 820, 300, C.amber, 0.3],
        ],
      }
    ),

  'blog/gemini-4-argon-explained/cover': () =>
    frame(
      1600,
      900,
      `${windowCard(250, 130, 1100, 680, { title: 'Gemini', accent: C.blue })}
      ${rect(300, 220, 420, 64, '#0f1529', 32, `stroke="${C.line}" stroke-width="2"`)}
      ${rect(306, 226, 204, 52, C.blue, 26)}${text(408, 260, 'Chat', { size: 22, weight: 700, anchor: 'middle', fill: '#fff' })}
      ${text(615, 260, 'Tasks', { size: 22, weight: 600, anchor: 'middle', fill: C.muted })}
      <g filter="url(#soft)">${rect(900, 214, 400, 76, C.card2, 18, `stroke="${C.blue}" stroke-opacity="0.6" stroke-width="2"`)}</g>
      <circle cx="944" cy="252" r="16" fill="url(#brand)"/>
      ${text(972, 260, 'Gemini 4 Argon', { size: 24, weight: 700 })}
      <path d="M1262 246 l10 10 l10 -10" stroke="${C.muted}" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${text(300, 360, 'Task: plan a dinner for six', { size: 26, weight: 700 })}
      ${[
        ['Find a recipe for six people', true],
        ['Add ingredients to grocery order', true],
        ['Book a table for Saturday', true],
        ['Send the plan to the group', false],
      ]
        .map(
          ([t, done], i) => `${rect(300, 400 + i * 88, 1000, 70, C.card2, 16)}
          ${done ? check(340, 435 + i * 88, 16, C.blue) : `<circle cx="340" cy="${435 + i * 88}" r="16" fill="none" stroke="${C.blue}" stroke-width="3" stroke-dasharray="6 5"/>`}
          ${text(376, 443 + i * 88, t, { size: 22, weight: 500, fill: done ? C.text : C.muted })}`
        )
        .join('')}
      ${text(300, 780, 'Works in the background · 40+ connected apps', { size: 20, fill: C.muted, weight: 500 })}`,
      {
        glows: [
          [1350, 120, 320, C.blue, 0.5],
          [250, 800, 300, C.violet, 0.4],
        ],
      }
    ),

  'blog/google-antigravity-free-tier-changes/cover': () =>
    frame(
      1600,
      900,
      `${windowCard(220, 140, 860, 640, { title: 'Models · Free plan', accent: C.sky })}
      ${[
        ['Gemini 3.8 Flash', 'keep'],
        ['Claude Sonnet 4.6', 'gone'],
        ['Claude Opus 4.6', 'gone'],
        ['GPT-OSS-120b', 'gone'],
        ['Gemini 4 Argon', 'paid'],
      ]
        .map(
          ([m, s], i) => `${rect(260, 230 + i * 104, 780, 82, C.card2, 16)}
          ${s === 'keep' ? check(304, 271 + i * 104, 17) : s === 'gone' ? cross(304, 271 + i * 104, 17) : `<circle cx="304" cy="${271 + i * 104}" r="17" fill="${C.amber}"/>${text(304, 279 + i * 104, '$', { size: 20, weight: 800, anchor: 'middle', fill: '#1f1300' })}`}
          ${text(340, 280 + i * 104, m, { size: 26, weight: 600, fill: s === 'gone' ? C.muted : C.text, extra: s === 'gone' ? 'text-decoration="line-through"' : '' })}
          ${pill(s === 'keep' ? 880 : s === 'paid' ? 890 : 840, 251 + i * 104, s === 'keep' ? 'Stays' : s === 'paid' ? 'Paid' : 'Removed', { fill: s === 'keep' ? 'rgba(16,185,129,0.18)' : s === 'paid' ? 'rgba(245,158,11,0.18)' : 'rgba(244,63,94,0.18)', color: s === 'keep' ? '#34d399' : s === 'paid' ? C.amber : '#fb7185', size: 17, h: 40, padX: 14 })}`
        )
        .join('')}
      <g filter="url(#shadow)">${rect(1150, 230, 280, 300, '#ffffff', 28)}</g>
      ${rect(1150, 230, 280, 90, C.rose, 28)}${rect(1150, 290, 280, 30, C.rose)}
      ${text(1290, 290, 'NOV', { size: 38, weight: 800, anchor: 'middle', fill: '#fff' })}
      ${text(1290, 470, '2', { size: 150, weight: 800, anchor: 'middle', fill: C.bg1 })}
      ${text(1290, 600, '2026', { size: 30, weight: 700, anchor: 'middle', fill: C.muted })}`,
      {
        glows: [
          [1350, 150, 320, C.sky, 0.45],
          [200, 800, 300, C.rose, 0.3],
        ],
      }
    ),

  'blog/cursor-new-pricing-explained/cover': () => {
    const tiers = [
      ['Free', '$0', 0.18, C.dim],
      ['Plus', '$8', 0.3, C.sky],
      ['Premium', '$30', 0.5, C.indigo],
      ['Super', '$100', 0.72, C.violet],
      ['Ultra', '$200', 0.95, C.pink],
    ]
    return frame(
      1600,
      900,
      `${pill(170, 80, 'CURSOR PRICING · 2026', { fill: 'rgba(255,255,255,0.1)', color: C.text, size: 20 })}
      ${text(170, 190, 'Free → Ultra', { size: 56, weight: 800 })}
      <path d="M170 790 H1430" stroke="${C.line}" stroke-width="3"/>
      ${tiers
        .map(([n, p, v, c], i) => {
          const x = 190 + i * 250
          const h = v * 520
          return `<g filter="url(#soft)">${rect(x, 790 - h, 200, h, c, 22, i === 2 ? 'stroke="#fff" stroke-width="4"' : '')}</g>
          ${text(x + 100, 790 - h + 62, p, { size: 40, weight: 800, anchor: 'middle', fill: '#fff' })}
          ${text(x + 100, 830, n, { size: 26, weight: 700, anchor: 'middle' })}
          ${i === 2 ? pill(x + 8, 790 - h - 60, 'Most popular', { fill: '#fff', color: C.bg1, size: 17, h: 38, padX: 14 }) : ''}`
        })
        .join('')}`,
      {
        glows: [
          [1350, 150, 320, C.violet, 0.45],
          [200, 800, 300, C.sky, 0.35],
        ],
      }
    )
  },

  'blog/chatgpt-ads-how-to-turn-off/cover': () =>
    frame(
      1600,
      900,
      `${windowCard(150, 140, 780, 660, { title: 'ChatGPT', accent: C.emerald })}
      ${rect(510, 230, 380, 64, C.emerald, 18, 'fill-opacity="0.22"')}${lines(536, 252, [320, 200], { fill: C.emerald, op: 0.9 })}
      ${rect(190, 330, 640, 150, C.card2, 18)}${lines(220, 362, [560, 520, 580, 300], { gap: 26 })}
      <g filter="url(#soft)">${rect(190, 510, 700, 230, '#0f1529', 20, `stroke="${C.amber}" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="10 8"`)}</g>
      ${pill(214, 532, 'Sponsored', { fill: 'rgba(245,158,11,0.18)', color: C.amber, size: 17, h: 36, padX: 14 })}
      ${rect(214, 594, 120, 120, C.card2, 16)}
      ${lines(360, 610, [440, 380, 300], { gap: 30, h: 12 })}
      ${rect(360, 690, 170, 40, C.amber, 12)}
      ${[0, 1, 2].map((i) => `<circle cx="${830 + i * 16}" cy="550" r="4" fill="${C.muted}"/>`).join('')}
      <g filter="url(#shadow)">${rect(990, 230, 470, 470, C.card, 24, `stroke="${C.line}" stroke-width="2"`)}</g>
      ${text(1030, 296, 'Manage ads', { size: 28, weight: 800 })}
      ${[
        ['Ad personalization', false],
        ['Use past chats & memory', false],
        ['Ad-free (fewer messages)', true],
      ]
        .map(
          ([t, on], i) => `${text(1030, 380 + i * 96, t, { size: 21, weight: 500 })}
          ${rect(1350, 356 + i * 96, 72, 38, on ? C.emerald : C.line, 19)}
          <circle cx="${on ? 1403 : 1369}" cy="${375 + i * 96}" r="15" fill="#fff"/>`
        )
        .join('')}
      ${rect(1030, 610, 390, 56, '#2a1520', 14, 'stroke="#fb7185" stroke-opacity="0.5" stroke-width="2"')}
      ${text(1225, 646, 'Delete ad data', { size: 21, weight: 700, anchor: 'middle', fill: '#fb7185' })}`,
      {
        glows: [
          [1350, 150, 320, C.amber, 0.3],
          [200, 800, 300, C.emerald, 0.35],
        ],
      }
    ),

  // Europe-focused articles (November 2026) ─────────────────────────────────
  'blog/eu-ai-act-2026-deadlines/cover': () => {
    const euStars = (cx, cy, R, r = 16) =>
      Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI / 6) * i - Math.PI / 2
        return star(cx + R * Math.cos(a), cy + R * Math.sin(a), r, '#facc15')
      }).join('')
    const steps = [
      ['Feb 2025', 'Bans + AI literacy', true],
      ['Aug 2025', 'General-purpose AI', true],
      ['Aug 2026', 'Transparency', true],
      ['Dec 2026', 'Deepfake ban', false],
      ['Dec 2027', 'High-risk AI', false],
      ['Aug 2028', 'AI in products', false],
    ]
    return frame(
      1600,
      900,
      `<g filter="url(#shadow)"><circle cx="300" cy="300" r="180" fill="#1e3a8a"/></g>
      ${euStars(300, 300, 120)}
      ${text(300, 312, 'AI ACT', { size: 34, weight: 800, anchor: 'middle', fill: '#fff' })}
      ${text(560, 250, 'EU AI Act', { size: 76, weight: 800 })}
      ${text(560, 320, 'What applies when', { size: 40, weight: 600, fill: C.muted })}
      ${pill(560, 360, 'UPDATED NOVEMBER 2026', { fill: 'rgba(250,204,21,0.15)', color: '#facc15', size: 18 })}
      <path d="M150 690 H1450" stroke="${C.line}" stroke-width="6" stroke-linecap="round"/>
      <path d="M150 690 H${150 + 2.5 * 260}" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
      ${steps
        .map(([d, l, done], i) => {
          const x = 150 + i * 260
          return `<circle cx="${x}" cy="690" r="18" fill="${done ? '#facc15' : C.bg2}" stroke="#facc15" stroke-width="5"/>
          ${text(x, 640, d, { size: 24, weight: 800, anchor: i === 0 ? 'start' : i === 5 ? 'end' : 'middle', fill: done ? '#facc15' : C.text })}
          ${text(x, 750, l, { size: 20, weight: 500, anchor: i === 0 ? 'start' : i === 5 ? 'end' : 'middle', fill: C.muted })}`
        })
        .join('')}
      ${text(150 + 2.5 * 260, 800, 'You are here', { size: 18, weight: 700, anchor: 'middle', fill: '#facc15' })}`,
      {
        glows: [
          [300, 300, 300, C.blue, 0.45],
          [1400, 150, 300, C.indigo, 0.35],
        ],
      }
    )
  },

  'blog/mistral-vibe-vs-chatgpt/cover': () =>
    frame(
      1600,
      900,
      `${pill(190, 80, 'AI ASSISTANTS FOR EUROPE', { fill: 'rgba(255,255,255,0.1)', color: C.text, size: 20 })}
      ${chatWindow(250, 190, 'Mistral Vibe', C.orange, 1)}
      ${chatWindow(950, 190, 'ChatGPT', C.emerald, 0)}
      ${vs(800, 450)}
      <g filter="url(#soft)">${rect(330, 740, 240, 52, '#1e3a8a', 26)}</g>
      ${Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI / 6) * i - Math.PI / 2
        return star(364 + 15 * Math.cos(a), 766 + 15 * Math.sin(a), 3.6, '#facc15')
      }).join('')}
      ${text(396, 774, 'Hosted in EU', { size: 20, weight: 700, fill: '#fff' })}`,
      {
        glows: [
          [300, 200, 300, C.orange, 0.35],
          [1350, 750, 300, C.emerald, 0.3],
        ],
      }
    ),

  'blog/european-alternatives-google-microsoft/cover': () => {
    const apps = [
      ['Mail', C.violet],
      ['Drive', C.sky],
      ['Docs', C.blue],
      ['Calendar', C.emerald],
      ['Translate', C.teal],
      ['AI chat', C.orange],
    ]
    return frame(
      1600,
      900,
      `${text(160, 200, 'Made in Europe', { size: 72, weight: 800 })}
      ${text(160, 262, 'Swap Big Tech apps for European ones', { size: 32, weight: 500, fill: C.muted })}
      ${apps
        .map(([n, c], i) => {
          const x = 160 + (i % 3) * 300
          const y = 340 + Math.floor(i / 3) * 250
          return `<g filter="url(#soft)">${rect(x, y, 260, 210, C.card, 28, `stroke="${C.line}" stroke-width="2"`)}</g>
          ${rect(x + 30, y + 30, 72, 72, c, 20)}
          ${lines(x + 30, y + 130, [180, 130], { gap: 22 })}
          ${text(x + 120, y + 78, n, { size: 26, weight: 700 })}`
        })
        .join('')}
      <g filter="url(#shadow)"><circle cx="1260" cy="560" r="220" fill="#1e3a8a"/></g>
      ${Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI / 6) * i - Math.PI / 2
        return star(1260 + 150 * Math.cos(a), 560 + 150 * Math.sin(a), 20, '#facc15')
      }).join('')}
      ${text(1260, 548, 'GDPR', { size: 44, weight: 800, anchor: 'middle', fill: '#fff' })}
      ${text(1260, 594, 'friendly', { size: 28, weight: 600, anchor: 'middle', fill: '#bfdbfe' })}`,
      {
        glows: [
          [1300, 500, 340, C.blue, 0.45],
          [200, 820, 300, C.violet, 0.3],
        ],
      }
    )
  },

  // Site images ───────────────────────────────────────────────────────────────
  'site/hero': () => {
    const tile = (
      x,
      y,
      name,
      cat,
      score,
      c
    ) => `<g filter="url(#soft)">${rect(x, y, 300, 200, C.card, 22, `stroke="${C.line}" stroke-width="2"`)}</g>
      ${rect(x + 24, y + 24, 52, 52, c, 14)}
      ${text(x + 92, y + 50, name, { size: 22, weight: 700 })}
      ${text(x + 92, y + 76, cat, { size: 17, fill: C.muted, weight: 500 })}
      ${stars(x + 36, y + 126, Math.round(score), 11, 26)}
      ${text(x + 266, y + 134, score.toFixed(1), { size: 24, weight: 800, anchor: 'end' })}
      ${rect(x + 24, y + 160, 252, 8, C.line, 4)}${rect(x + 24, y + 160, (252 * score) / 5, 8, c, 4)}`
    return frame(
      1400,
      980,
      `${windowCard(110, 70, 1180, 830, { fill: '#10172e' })}
      ${rect(300, 92, 600, 40, '#0b1124', 20, `stroke="${C.line}" stroke-width="2"`)}
      <circle cx="330" cy="112" r="9" fill="none" stroke="${C.muted}" stroke-width="2.5"/><path d="M337 119 l7 7" stroke="${C.muted}" stroke-width="2.5" stroke-linecap="round"/>
      ${text(356, 120, 'Search reviews…', { size: 18, fill: C.dim, weight: 500 })}
      <g filter="url(#soft)">${rect(150, 190, 520, 420, C.card, 26, `stroke="${C.line}" stroke-width="2"`)}</g>
      ${pill(180, 220, "EDITOR'S PICK", { fill: C.amber, color: '#1f1300', size: 16, h: 34, padX: 14 })}
      ${ring(290, 400, 90, 4.8, C.emerald, { width: 18, label: false })}
      ${text(290, 412, '4.8', { size: 52, weight: 800, anchor: 'middle' })}
      ${text(290, 446, 'out of 5', { size: 16, fill: C.muted, weight: 500, anchor: 'middle' })}
      ${text(420, 340, 'Excellent', { size: 30, weight: 800, fill: '#34d399' })}
      ${stars(432, 382, 5, 13, 32)}
      ${lines(420, 420, [210, 170, 190], { fill: C.dim, gap: 26 })}
      ${rect(180, 530, 460, 56, 'url(#brand)', 16)}
      ${text(410, 566, 'Read the review', { size: 22, weight: 700, anchor: 'middle', fill: '#fff' })}
      <g filter="url(#soft)">${rect(700, 190, 550, 420, C.card, 26, `stroke="${C.line}" stroke-width="2"`)}</g>
      ${text(730, 240, 'Compare', { size: 24, weight: 700 })}
      ${['Free plan', 'AI features', 'Offline mode', 'Team sharing', 'Price / mo'].map((r, i) => `${text(730, 300 + i * 62, r, { size: 19, fill: C.muted, weight: 500 })}<path d="M730 ${318 + i * 62} H1220" stroke="${C.line}" stroke-width="1.5"/>`).join('')}
      ${rect(980, 258, 120, 330, C.indigo, 14, 'fill-opacity="0.14"')}
      ${[
        [true, false],
        [true, true],
        [true, false],
        [false, true],
      ]
        .map(
          ([a, b], i) =>
            `${a ? check(1040, 294 + i * 62, 14) : cross(1040, 294 + i * 62, 14)}${b ? check(1160, 294 + i * 62, 14) : cross(1160, 294 + i * 62, 14)}`
        )
        .join('')}
      ${text(1040, 547, '$10', { size: 20, weight: 700, anchor: 'middle' })}${text(1160, 547, '$20', { size: 20, weight: 700, anchor: 'middle' })}
      ${tile(150, 650, 'AI Writer', 'AI Tools', 4.6, C.violet)}
      ${tile(490, 650, 'Code Agent', 'Developer Tools', 4.8, C.sky)}
      ${tile(830, 650, 'Notes App', 'Productivity', 4.4, C.emerald)}
      <g filter="url(#shadow)" transform="rotate(4 1180 760)">${rect(1110, 660, 150, 200, 'url(#brand)', 24)}</g>
      <g transform="rotate(4 1180 760)">${text(1185, 752, '2026', { size: 44, weight: 800, anchor: 'middle', fill: '#fff' })}${text(1185, 792, 'best-of', { size: 20, weight: 600, anchor: 'middle', fill: '#fff' })}${text(1185, 818, 'picks', { size: 20, weight: 600, anchor: 'middle', fill: '#fff' })}</g>`,
      {
        glows: [
          [1200, 120, 300, C.indigo, 0.5],
          [200, 950, 300, C.cyan, 0.35],
        ],
        bg: ['#0a0f1f', '#10172e'],
      }
    )
  },

  'site/about': () =>
    frame(
      1600,
      900,
      `<path d="M0 760 H1600" stroke="${C.line}" stroke-width="4"/>
      ${rect(0, 760, 1600, 140, '#0d1428')}
      <!-- monitor -->
      <g filter="url(#shadow)">${rect(420, 130, 760, 470, '#0f1529', 28, `stroke="${C.line}" stroke-width="6"`)}</g>
      ${rect(440, 150, 720, 430, C.card, 16)}
      ${rect(760, 600, 80, 110, '#1e2a4a')}${rect(660, 700, 280, 26, '#1e2a4a', 13)}
      ${rect(470, 180, 660, 44, '#0b1124', 12)}${lines(492, 197, [160], { fill: C.dim })}
      ${rect(470, 246, 320, 300, C.card2, 16)}
      ${ring(560, 340, 54, 4.7, C.emerald, { width: 12 })}
      ${stars(500, 430, 5, 10, 24)}
      ${lines(496, 462, [240, 200, 220], { fill: C.dim, gap: 24 })}
      ${rect(810, 246, 320, 140, C.card2, 16)}
      ${[0, 1, 2].map((i) => `${rect(834, 272 + i * 36, 200, 10, C.dim, 5)}${check(1096, 277 + i * 36, 11)}`).join('')}
      ${rect(810, 406, 320, 140, C.card2, 16)}
      ${[0.8, 0.55, 0.92, 0.7].map((v, i) => rect(840 + i * 70, 520 - v * 90, 40, v * 90, [C.violet, C.sky, C.emerald, C.amber][i], 8)).join('')}
      <!-- magnifier over the review card -->
      <g filter="url(#soft)"><circle cx="760" cy="300" r="70" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-width="12"/></g>
      <path d="M810 352 L880 422" stroke="#ffffff" stroke-width="22" stroke-linecap="round"/>
      <!-- laptop -->
      <g filter="url(#soft)">${rect(1220, 520, 300, 200, '#0f1529', 16, `stroke="${C.line}" stroke-width="5"`)}</g>
      ${rect(1236, 536, 268, 168, '#0b1124', 8)}
      ${lines(1256, 560, [120, 180, 90, 150, 110], { fill: C.sky, op: 0.7, gap: 26 })}
      ${rect(1180, 720, 380, 22, '#1e2a4a', 11)}
      <!-- mug -->
      ${rect(250, 640, 110, 120, '#f8fafc', 18)}<path d="M360 670 c46 0 46 64 0 64" stroke="#f8fafc" stroke-width="14" fill="none"/>
      ${rect(270, 670, 70, 12, C.indigo, 6)}
      <path d="M285 610 c-14 -20 14 -30 0 -50 M320 610 c-14 -20 14 -30 0 -50" stroke="#94a3b8" stroke-width="5" fill="none" stroke-linecap="round" stroke-opacity="0.6"/>
      <!-- plant -->
      ${rect(80, 650, 110, 110, C.orange, 14)}
      <path d="M135 650 C 100 560 60 560 60 500 C 110 520 130 570 135 650 Z" fill="${C.emerald}"/>
      <path d="M135 650 C 160 540 210 520 230 470 C 240 560 170 590 135 650 Z" fill="${C.teal}"/>
      <path d="M135 650 C 130 560 140 500 150 440 C 175 520 160 590 135 650 Z" fill="${C.lime}"/>
      <!-- sticky notes on the wall -->
      <g transform="rotate(-6 250 260)" filter="url(#soft)">${rect(170, 180, 170, 160, C.yellow, 8)}${lines(194, 222, [110, 90, 120], { fill: '#a16207', op: 0.45, gap: 26 })}</g>
      <g transform="rotate(5 1380 250)" filter="url(#soft)">${rect(1300, 170, 170, 160, '#f9a8d4', 8)}${lines(1324, 212, [110, 120, 80], { fill: '#9d174d', op: 0.4, gap: 26 })}</g>`,
      {
        glows: [
          [1300, 120, 300, C.indigo, 0.45],
          [250, 200, 260, C.cyan, 0.3],
        ],
      }
    ),
}

// ── Render ────────────────────────────────────────────────────────────────────
const filter = process.argv[2]
for (const [name, build] of Object.entries(images)) {
  if (filter && !name.includes(filter)) continue
  const out = path.join('public/static/images', `${name}.webp`)
  mkdirSync(path.dirname(out), { recursive: true })
  const info = await sharp(Buffer.from(build()), { density: 96 })
    .webp({ quality: 86, effort: 6 })
    .toFile(out)
  console.log(`${out}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
}
