import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

/**
 * /ads.txt, generated from NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-XXXX → pub-XXXX).
 * AdSense shows an "ads.txt not found" warning until this returns your publisher line.
 */
export function GET() {
  const client = siteMetadata.adsense.client
  const body = client
    ? `google.com, ${client.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`
    : '# Set NEXT_PUBLIC_ADSENSE_CLIENT to publish your AdSense ads.txt line\n'
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
