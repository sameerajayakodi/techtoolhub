/**
 * Central registry of the tools we link to.
 *
 * Every "Try X" button in an article points to /go/<slug> (app/go/[tool]/route.ts), which
 * redirects to `affiliateUrl` once it is filled in, and to the official `fallbackUrl` until then.
 * Changing a link here updates every article at once.
 *
 * To activate an affiliate link:
 *   1. Join the tool's program and copy your tracking link from its dashboard.
 *   2. Paste it into `affiliateUrl` (must start with https://) and fill `program` and
 *      `commissionNote`, so you know where the money comes from.
 *   3. Never invent links: leave `affiliateUrl: TODO` until you have a real one.
 *   4. If the program's terms ban redirect links (Proton's do), set `directLink: true`: buttons
 *      then link straight to the affiliate URL instead of /go/<slug>. Link to such a tool with
 *      <AffiliateButton> or <ToolCard>, never a Markdown /go/ link.
 *
 * `pricingFrom` is shown on <ToolCard />. The values below were copied from our articles (see
 * `pricingCheckedOn`); re-check them on the vendor's pricing page before relying on them.
 */

/** Placeholder for anything you still have to fill in */
export const TODO = 'TODO'

export interface AffiliateTool {
  name: string
  /** Your tracking link from the affiliate dashboard. TODO until you have joined the program */
  affiliateUrl: string
  /** The tool's official website or pricing page, used while affiliateUrl is TODO */
  fallbackUrl: string
  /** Where the program runs, e.g. "PartnerStack", "Impact", "direct" */
  program: string
  /** Your own note on commission rate, cookie length and payout method (e.g. works from Sri Lanka?) */
  commissionNote: string
  /** One-line description for <ToolCard /> */
  summary: string
  /** Short price line for <ToolCard />, e.g. "Free · Pro $20/mo" */
  pricingFrom?: string
  /** When pricingFrom was last checked (YYYY-MM) */
  pricingCheckedOn?: string
  /** Link buttons straight to the outbound URL instead of /go/<slug> (program bans redirects) */
  directLink?: boolean
}

export const affiliates = {
  // ── AI assistants ─────────────────────────────────────────────
  chatgpt: {
    name: 'ChatGPT',
    affiliateUrl: TODO,
    fallbackUrl: 'https://chatgpt.com/',
    program: TODO,
    commissionNote: TODO,
    summary: 'OpenAI’s general-purpose AI assistant for chat, writing, images, research and code.',
    pricingFrom: 'Free · Go $8/mo · Plus $20/mo',
    pricingCheckedOn: '2026-10',
  },
  claude: {
    name: 'Claude',
    affiliateUrl: TODO,
    fallbackUrl: 'https://claude.com/pricing',
    program: TODO,
    commissionNote: TODO,
    summary: 'Anthropic’s AI assistant, strong at writing, analysis and coding.',
    pricingFrom: 'Free · Pro $20/mo ($17/mo yearly)',
    pricingCheckedOn: '2026-10',
  },
  gemini: {
    name: 'Gemini',
    affiliateUrl: TODO,
    fallbackUrl: 'https://gemini.google.com/',
    program: TODO,
    commissionNote: TODO,
    summary: 'Google’s AI assistant, built into Gmail, Docs and Drive.',
    pricingFrom: 'Free · Google AI Pro $19.99/mo',
    pricingCheckedOn: '2026-10',
  },
  mistral: {
    name: 'Mistral Vibe',
    affiliateUrl: TODO,
    fallbackUrl: 'https://mistral.ai/pricing',
    program: TODO,
    commissionNote: TODO,
    summary: 'European AI assistant from Mistral AI (formerly Le Chat), with EU data hosting.',
    pricingFrom: 'Free · Pro €14.99/mo',
    pricingCheckedOn: '2026-11',
  },

  // ── Developer tools ───────────────────────────────────────────
  'claude-code': {
    name: 'Claude Code',
    affiliateUrl: TODO,
    fallbackUrl: 'https://claude.com/pricing',
    program: TODO,
    commissionNote: TODO,
    summary: 'Anthropic’s coding agent for the terminal, IDE and web.',
    pricingFrom: 'Included with Claude Pro ($20/mo)',
    pricingCheckedOn: '2026-10',
  },
  cursor: {
    name: 'Cursor',
    affiliateUrl: TODO,
    fallbackUrl: 'https://cursor.com/pricing',
    program: TODO,
    commissionNote: TODO,
    summary: 'AI code editor with chat, autocomplete and coding agents.',
    pricingFrom: 'Free · Premium $30/mo',
    pricingCheckedOn: '2026-10',
  },
  'github-copilot': {
    name: 'GitHub Copilot',
    affiliateUrl: TODO,
    fallbackUrl: 'https://github.com/features/copilot/plans',
    program: TODO,
    commissionNote: TODO,
    summary: 'GitHub’s AI pair programmer for VS Code, JetBrains and github.com.',
    pricingFrom: 'Free · Pro $10/mo',
    pricingCheckedOn: '2026-10',
  },
  'openai-codex': {
    name: 'OpenAI Codex',
    affiliateUrl: TODO,
    fallbackUrl: 'https://openai.com/codex/',
    program: TODO,
    commissionNote: TODO,
    summary: 'OpenAI’s coding agent, included with ChatGPT paid plans.',
    pricingFrom: 'Included with ChatGPT Plus ($20/mo)',
    pricingCheckedOn: '2026-10',
  },
  'google-antigravity': {
    name: 'Google Antigravity',
    affiliateUrl: TODO,
    fallbackUrl: 'https://antigravity.google/',
    program: TODO,
    commissionNote: TODO,
    summary: 'Google’s agent-first code editor powered by Gemini.',
    pricingFrom: 'Free (weekly limits) · Google AI Pro $19.99/mo',
    pricingCheckedOn: '2026-10',
  },
  'devin-desktop': {
    name: 'Devin Desktop',
    affiliateUrl: TODO,
    fallbackUrl: 'https://devin.ai/desktop',
    program: TODO,
    commissionNote: TODO,
    summary: 'AI code editor from Cognition (formerly Windsurf).',
    pricingFrom: 'Free · Pro $20/mo',
    pricingCheckedOn: '2026-10',
  },

  // ── Productivity ──────────────────────────────────────────────
  notion: {
    name: 'Notion',
    affiliateUrl: TODO,
    fallbackUrl: 'https://www.notion.com/pricing',
    program: TODO,
    commissionNote: TODO,
    summary: 'All-in-one workspace for notes, docs, wikis and projects.',
    pricingFrom: 'Free · Plus $10 per member/mo',
    pricingCheckedOn: '2026-10',
  },
  obsidian: {
    name: 'Obsidian',
    affiliateUrl: TODO,
    fallbackUrl: 'https://obsidian.md/pricing',
    program: TODO,
    commissionNote: TODO,
    summary: 'Private, offline-first notes stored as Markdown files on your device.',
    pricingFrom: 'Free · Sync $4/mo (yearly)',
    pricingCheckedOn: '2026-10',
  },
  evernote: {
    name: 'Evernote',
    affiliateUrl: TODO,
    fallbackUrl: 'https://evernote.com/compare-plans',
    program: TODO,
    commissionNote: TODO,
    summary: 'Long-running note-taking app with web clipping and document search.',
    pricingFrom: 'Free (50 notes) · Starter ≈ $99/yr',
    pricingCheckedOn: '2026-10',
  },
  proton: {
    name: 'Proton',
    affiliateUrl: TODO,
    fallbackUrl: 'https://proton.me/pricing',
    program: TODO,
    commissionNote: TODO,
    summary: 'Encrypted Mail, Drive, Calendar, Pass and VPN from Switzerland.',
    pricingFrom: 'Free · Mail Plus $3.99/mo (yearly)',
    pricingCheckedOn: '2026-11',
    // Proton's partner terms ban "deceptive redirecting links" and Proton trademarks in page URLs
    directLink: true,
  },
  tuta: {
    name: 'Tuta',
    affiliateUrl: TODO,
    fallbackUrl: 'https://tuta.com/pricing',
    program: TODO,
    commissionNote: TODO,
    summary: 'Encrypted email and calendar hosted in Germany.',
    pricingFrom: 'Free (1 GB) · paid plans available',
    pricingCheckedOn: '2026-11',
  },
  nextcloud: {
    name: 'Nextcloud',
    affiliateUrl: TODO,
    fallbackUrl: 'https://nextcloud.com/pricing/',
    program: TODO,
    commissionNote: TODO,
    summary: 'Self-hosted or German-hosted files, chat and collaboration hub.',
    pricingFrom: 'Free self-hosted',
    pricingCheckedOn: '2026-11',
  },
  onlyoffice: {
    name: 'ONLYOFFICE',
    affiliateUrl: TODO,
    fallbackUrl: 'https://www.onlyoffice.com/docspace-prices.aspx',
    program: TODO,
    commissionNote: TODO,
    summary: 'Microsoft Office-compatible document editors in the cloud or self-hosted.',
    pricingFrom: 'Free (3 admins) · Business $20/admin/mo',
    pricingCheckedOn: '2026-11',
  },
  deepl: {
    name: 'DeepL',
    affiliateUrl: TODO,
    fallbackUrl: 'https://www.deepl.com/pro',
    program: TODO,
    commissionNote: TODO,
    summary: 'AI translation and writing assistant from Germany.',
    pricingFrom: 'Free · Individual €7.49/mo (yearly)',
    pricingCheckedOn: '2026-11',
  },
} satisfies Record<string, AffiliateTool>

export type ToolSlug = keyof typeof affiliates

export function getTool(slug: string): AffiliateTool | undefined {
  return Object.prototype.hasOwnProperty.call(affiliates, slug)
    ? affiliates[slug as ToolSlug]
    : undefined
}

/** Like getTool, but fails the build on a typo in an article's tool="..." */
export function requireTool(slug: string): AffiliateTool {
  const tool = getTool(slug)
  if (!tool) throw new Error(`Unknown tool "${slug}". Add it to lib/affiliates.ts first.`)
  return tool
}

export const hasAffiliateUrl = (tool: AffiliateTool) => /^https:\/\//.test(tool.affiliateUrl)

/** Where /go/<slug> sends the visitor */
export const outboundUrl = (tool: AffiliateTool) =>
  hasAffiliateUrl(tool) ? tool.affiliateUrl : tool.fallbackUrl

/** Internal path affiliate buttons link to */
export const goPath = (slug: string) => `/go/${slug}`

/** Where an affiliate button for this tool points: /go/<slug>, or the outbound URL for directLink tools */
export const toolHref = (slug: string) => {
  const tool = requireTool(slug)
  return tool.directLink ? outboundUrl(tool) : goPath(slug)
}

/** rel for every outbound affiliate link (Google: rel="sponsored" for paid links) */
export const AFFILIATE_REL = 'sponsored nofollow noopener'
