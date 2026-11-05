/**
 * Tells Bing (and the other IndexNow search engines) which URLs changed, so they recrawl them
 * quickly. Run it after a deploy is live, not before: the engines fetch the URLs straight away.
 *
 *   npm run indexnow                    URLs whose sitemap lastmod is within the last 7 days
 *   npm run indexnow -- --days 30       ...within the last 30 days
 *   npm run indexnow -- --all           every URL in the sitemap
 *   npm run indexnow -- /blog/some-post https://www.techtoolhub.online/other   just these
 *   add --dry-run to print the list without sending it
 *
 * The key is public by design: search engines check it at https://<host>/<key>.txt
 * (public/<key>.txt). Keep the file and this constant in sync if you change it.
 */
import siteMetadata from '../data/siteMetadata.js'

const KEY = '822a6d653d395d3c7b5b69e896619af4'
const SITE = siteMetadata.siteUrl.replace(/\/$/, '')
const HOST = new URL(SITE).host

const args = process.argv.slice(2)
const flag = (name) => args.includes(name)
const daysArg = args.indexOf('--days')
const days = daysArg >= 0 ? Number(args[daysArg + 1]) : 7
const explicit = args.filter((a, i) => !a.startsWith('--') && !(daysArg >= 0 && i === daysArg + 1))

async function sitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`)
  if (!res.ok) throw new Error(`Sitemap returned ${res.status}`)
  const xml = await res.text()
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, entry]) => ({
    loc: entry.match(/<loc>([^<]+)<\/loc>/)?.[1],
    lastmod: entry.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
  }))
}

async function main() {
  let urls
  if (explicit.length) {
    urls = explicit.map((u) => new URL(u, SITE).href)
  } else {
    const entries = await sitemapUrls()
    const since = Date.now() - days * 24 * 60 * 60 * 1000
    urls = entries
      .filter((e) => e.loc && (flag('--all') || (e.lastmod && Date.parse(e.lastmod) >= since)))
      .map((e) => e.loc)
  }
  urls = [...new Set(urls)].filter((u) => new URL(u).host === HOST)

  if (!urls.length) {
    console.log('IndexNow: no URLs to submit.')
    return
  }
  console.log(`IndexNow: ${urls.length} URL(s)\n  ${urls.join('\n  ')}`)
  if (flag('--dry-run')) return

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList: urls,
    }),
  })
  // 200 = accepted, 202 = accepted and the key is still being checked
  console.log(`IndexNow: ${res.status} ${res.statusText}`)
  if (res.status >= 300) {
    console.log(await res.text())
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(err.message)
  process.exitCode = 1
})
