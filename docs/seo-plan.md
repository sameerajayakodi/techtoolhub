# TechToolHub SEO plan

Written 2026-11-05. Review it monthly against Search Console data.

## 1. Where we stand

**Already in place (good):**

- Clean technical base: static pages, canonical URLs on www, XML sitemap, robots.txt that allows search and AI crawlers, HTTPS, security headers.
- Structured data: Organization + WebSite on the home page, BlogPosting/NewsArticle + BreadcrumbList + Person on articles, ProfilePage on /author, Review markup only when `handsOn: true`.
- Unique titles and meta descriptions (126–159 characters on the pages checked), one H1 per page, alt text on images, per-post OG images.
- Search Console verified, sitemap submitted, first 10 URLs sent for indexing (2026-11-03).
- 12 published articles, 2 drafts.

**Gaps found in the audit:**

| Gap                                                                                         | Why it matters                                                                                                           | Who                                  |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| No article is hands-on tested yet (`handsOn: false` everywhere)                             | The 2026 core updates hit affiliate sites without first-hand testing the hardest. This is our biggest risk.              | Sameera                              |
| `hello@techtoolhub.online` bounces                                                          | A broken contact address is a trust signal problem, and the privacy policy points to it.                                 | Sameera (give a forward address)     |
| Author avatar is still the placeholder                                                      | Weakens the "real person behind the site" signal.                                                                        | Sameera (photo), Claude (add it)     |
| 18 of 31 tag pages list only 1 post, and all tags are in the sitemap                        | Near-duplicate thin pages dilute crawl and quality signals.                                                              | Claude                               |
| Not in Bing Webmaster Tools; no IndexNow                                                    | Bing powers Copilot and DuckDuckGo results. ChatGPT search uses third-party search providers (OpenAI doesn't name them). | Sameera (sign-in), Claude (IndexNow) |
| Content is spread over 3 categories with ~4 posts each, and 5 posts are short-lived AI news | No topic has enough depth to look like an authority yet; news posts decay in weeks.                                      | Both                                 |
| Mobile article pages show three 300x250 ads                                                 | Heavy ad density on mobile hurts page experience.                                                                        | Claude                               |
| Core Web Vitals not measured (PageSpeed API quota was used up today)                        | Need a baseline before and after ads.                                                                                    | Claude (retry)                       |

## 2. What works in SEO now (research summary)

- **Google's own line: "AI search is still search."** AI Overviews and AI Mode draw from the normal index. There's no special AI markup or file to add; crawlable pages, internal links, good page experience and helpful content are what count. ([Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features), [Search Engine Journal summary](https://www.searchenginejournal.com/googles-official-advice-on-optimizing-for-ai-overviews-ai-mode/547341/))
- **First-hand experience is the line between winners and losers for affiliate sites.** Trackers report most affiliate sites lost rankings in the March 2026 core update; sites with original testing and real expertise held up. The exact percentages come from vendor trackers, so treat them as rough. ([Affiverse](https://www.affiversemedia.com/googles-march-2026-core-update-hit-affiliate-sites-harder-than-any-other-category/), [Aff Rate audit](https://affrate.com/news-analysis/google-march-2026-update-affiliate-site-audit/))
- **Google's review guidance** asks for evidence of use (own photos, measurements, test results), comparisons with alternatives, and clear reasons for a "best" pick. ([Google: Write high quality reviews](https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews))
- **Topical depth beats breadth for a new site.** A small site that covers one subject thoroughly can outrank bigger general sites in that subject. Long-tail, low-competition queries can rank in roughly 1–3 months; head terms take 6–12+ months. These are vendor estimates, not Google figures. ([ShoutMeLoud](https://www.shoutmeloud.com/seo-topical-authority.html), [SEO Space](https://www.seospace.co/blog/topical-authority-seo))
- **AI answer engines cite clear, direct, sourced answers.** Put the answer early, back it with specific facts and named sources, and keep pages fresh. Only about 11% of domains are cited by both ChatGPT and Perplexity, so each engine is its own channel. ([Leapd](https://www.leapd.ai/blog/ai-visibility/how-chatgpt-google-ai-overviews-and-perplexity-source-information-in-2026), [GEO paper](https://arxiv.org/pdf/2509.08919))
- **Bing + IndexNow** are confirmed to help Bing and Copilot. A link to ChatGPT visibility is likely but not confirmed by OpenAI. Bing Webmaster Tools also has an AI Performance report (citations in Copilot). ([eSEOspace fact-check](https://eseospace.com/blog/bing-webmaster-tools-indexnow-ai-search/))
- **What to avoid:** mass-produced AI pages, bought links, expired-domain tricks and fake testing claims. These are what the 2026 spam updates targeted. ([Stan Ventures](https://www.stanventures.com/news/7-google-spam-updates-later-where-seo-stands-in-2026-7573/))

## 3. Strategy

**Own one topic first: "free and private alternatives to Microsoft and Google."**

Why this topic:

- It fits both live affiliate programs: ONLYOFFICE (18%) and Proton (pending).
- The pillar page already exists: [Best Free Microsoft Office Alternatives](https://www.techtoolhub.online/blog/best-free-microsoft-office-alternatives), plus the European alternatives article and two drafts.
- Search demand is real and specific (Google autocomplete, 2026-11-05): "onlyoffice vs libreoffice", "libreoffice vs microsoft office", "free microsoft office alternative for mac / chromebook / windows 11 / ipad", "excel alternative free", "google docs alternative no ai", "proton mail vs gmail", "gmail alternative without phone number".
- Sameera can actually test everything in it for free, so every article can be hands-on.

AI tools stay as the second topic, but only evergreen comparisons. No new short-lived news posts unless one can be written within a day of the news and updated after.

**The moat: an original Office compatibility test.** Build one set of test files (a .docx with tracked changes, comments, tables and images; an .xlsx with formulas, pivot tables and charts; a .pptx with animations). Open each in every suite, record what breaks, and publish screenshots and a results table. That is first-hand data nobody else has, and every article in the topic can cite and link it. It also earns links naturally.

## 4. Action plan

### Phase 1: foundations (this week)

| #   | Task                                                                                                      | Who     |
| --- | --------------------------------------------------------------------------------------------------------- | ------- |
| 1.1 | Give a forward address for hello@ (Namecheap email forwarding)                                            | Sameera |
| 1.2 | Add Bing Webmaster Tools by importing from Search Console; submit the sitemap                             | Sameera |
| 1.3 | IndexNow: key file in /public and a script that pings changed URLs after deploy                           | Claude  |
| 1.4 | Tag pages: noindex tags with fewer than 2 posts and drop them from the sitemap                            | Claude  |
| 1.5 | Mobile ads: keep the after-intro and end-of-article slots, drop or lazy-gate mid-article on small screens | Claude  |
| 1.6 | Measure Core Web Vitals (PageSpeed Insights) for home + 2 articles and record the baseline here           | Claude  |
| 1.7 | Author photo (optional but recommended)                                                                   | Sameera |
| 1.8 | Request indexing for the remaining URLs (about 10 a day)                                                  | Sameera |
| 1.9 | New logo (tool grid) and favicons at 48, 96 and 192px plus SVG, so Google can show the icon in results    | Claude  |

**Status (2026-11-05):** 1.3–1.6 and 1.9 are done and live. IndexNow accepted all 40 sitemap URLs (202). Run `npm run indexnow` after each deploy.

**Speed baseline (2026-11-05, Lighthouse mobile, run locally because the PageSpeed API quota was used up):**

| Page                                    | Performance | LCP   | CLS | TBT    | SEO |
| --------------------------------------- | ----------- | ----- | --- | ------ | --- |
| Home                                    | 93          | 2.7 s | 0   | 150 ms | 92  |
| Best free Microsoft Office alternatives | 96          | 2.0 s | 0   | 150 ms | 92  |

SEO lost points only for "Learn more" link text, now fixed. Re-check with real-user data in Search Console (Core Web Vitals report) once there's enough traffic.

### Phase 2: content cluster (weeks 1–8, about 2 posts a week)

Each post needs Sameera's own testing (screenshots, notes) before `handsOn: true`. Claude drafts from research and leaves TODOs for test results.

| Priority | Article                                        | Target query                                                 | Notes                                    |
| -------- | ---------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| 1        | Office compatibility test (data page)          | "libreoffice docx compatibility", "onlyoffice compatibility" | The moat. Everything else links to it.   |
| 2        | ONLYOFFICE vs Microsoft 365                    | "onlyoffice vs microsoft office"                             | Draft exists; needs testing. Affiliate.  |
| 3        | ONLYOFFICE vs LibreOffice (vs WPS)             | "onlyoffice vs libreoffice"                                  | Strong autocomplete demand. Affiliate.   |
| 4        | LibreOffice vs Microsoft Office                | "libreoffice vs microsoft office"                            | Links to the test.                       |
| 5        | Proton Mail vs Tuta                            | "proton mail vs tuta mail"                                   | Draft exists; waits for Proton approval. |
| 6        | Free Office for Mac                            | "free microsoft office alternative for mac"                  | Platform spoke.                          |
| 7        | Free Office for Chromebook                     | "...for chromebook"                                          | Platform spoke.                          |
| 8        | Free Excel alternatives                        | "excel alternative free"                                     | Spreadsheet-specific.                    |
| 9        | Google Docs alternatives (incl. no-AI options) | "google docs alternative no ai"                              | Fresh angle with demand.                 |
| 10       | Proton Mail vs Gmail                           | "proton mail vs gmail"                                       | Affiliate once approved.                 |
| 11       | Gmail alternatives (incl. no phone number)     | "gmail alternative without phone number"                     | Email pillar.                            |

Writing standard for every article:

- Answer the query in the first 2–3 sentences, then the verdict box.
- Own screenshots and a "How I tested" section with dates and versions.
- Comparison table, then sections per tool, then FAQ.
- Link up to the pillar, across to 2–3 siblings, and to the compatibility test.
- Sources section with official pages.
- Title under about 60 characters with the year; meta description 140–160 characters.

### Phase 3: authority and links (from week 3, ongoing)

- Share the compatibility test where people already ask about this: relevant subreddits (helpful answers first, links only where allowed), LibreOffice and ONLYOFFICE community forums, Hacker News "Show HN".
- Get listed on alternative directories that link out, such as AlternativeTo (tool pages link to reviews) and European-alternatives lists.
- Offer the test files on GitHub so others can reuse and link them.
- No bought links, link exchanges or PBNs.

### Phase 4: measure and refresh (monthly)

- Search Console: queries with impressions but position 8–20 get a content refresh first.
- Refresh every article at least every 3 months: prices, versions, `lastmod`.
- Merge or update the AI news posts once their news has passed (for example, fold GPT-6 and Gemini 4 news into the ChatGPT vs Claude vs Gemini comparison and redirect).
- GA4: track AI referrals (chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com) and affiliate clicks per article.
- Bing Webmaster Tools AI Performance report: which pages Copilot cites.

## 5. Realistic targets

| By          | Target                                                                                    |
| ----------- | ----------------------------------------------------------------------------------------- |
| End of 2026 | All URLs indexed; first long-tail queries in the top 20                                   |
| Feb 2027    | 25+ articles, 10+ hands-on; compatibility test published and linked from 5+ outside sites |
| May 2027    | Top 10 for several "X vs Y" office and email queries; steady affiliate clicks             |

New domains usually need 6–12 months to compete on bigger terms, so judge progress on impressions and long-tail rankings first, not clicks.
