import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

/**
 * /ads.txt, built at deploy time from environment variables:
 * - ADS_TXT: the full file content (use "\n" between lines). Use this if you add other ad
 *   networks or AdSense gives you a different line.
 * - Otherwise generated from NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-XXXX → pub-XXXX).
 * AdSense shows an "ads.txt not found" warning until this returns your publisher line.
 */
export function GET() {
  const custom = process.env.ADS_TXT?.replace(/\\n/g, '\n').trim()
  const client = siteMetadata.adsense.client
  const body = custom
    ? `${custom}\n`
    : client
      ? `google.com, ${client.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`
      : '# TODO: set NEXT_PUBLIC_ADSENSE_CLIENT (or ADS_TXT) on Vercel once AdSense approves the site\n'
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
