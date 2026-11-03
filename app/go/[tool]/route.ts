import { NextResponse } from 'next/server'
import { getTool, outboundUrl } from '@/lib/affiliates'

/**
 * /go/<tool>: outbound redirect for affiliate buttons (see lib/affiliates.ts).
 * 302 (temporary) so the target can change to an affiliate link later without browsers or
 * search engines caching the old destination. Disallowed in robots.txt.
 */
export const dynamic = 'force-dynamic'

const headers = { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' }

export async function GET(_req: Request, { params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params
  const tool = getTool(slug)
  if (!tool) return new Response('Unknown tool', { status: 404, headers })
  return NextResponse.redirect(outboundUrl(tool), { status: 302, headers })
}
