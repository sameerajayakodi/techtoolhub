# TechToolHub: Tech & Digital Tools Review Portal

A fast, SEO-first review site for AI tools, developer tools and productivity software.
It's built on [timlrx/tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) v2.4 and extended with review components, AdSense, dynamic OG images and rich JSON-LD.

| Stack     |                                                                                        |
| --------- | -------------------------------------------------------------------------------------- |
| Framework | Next.js 15.5 (App Router, React 19, TypeScript), fully static output                   |
| Styling   | Tailwind CSS 4 + Typography, dark mode (system / light / dark)                         |
| Content   | MDX files via Contentlayer2 (no database)                                              |
| Search    | Ctrl/⌘ K command palette (kbar, local `search.json`) + instant filter on listing pages |
| Hosting   | Vercel Hobby (free)                                                                    |

---

## Step 1: Starter & local setup

**Why this starter:** `tailwind-nextjs-starter-blog` is the most widely used Next.js MDX blog starter (10k+ ⭐, actively maintained). It ships with App Router, Contentlayer2, kbar search, tags, RSS, sitemap and good Lighthouse scores, so we only had to add the review-specific parts.

This repo already contains the customised starter. The original bootstrap was:

```bash
npx degit timlrx/tailwind-nextjs-starter-blog techtoolhub
```

To run this project locally (Node 20.9+; tested on Node 22):

```bash
cd techtoolhub
npm install
cp .env.example .env.local   # optional: every key is optional
npm run dev                  # http://localhost:3000
```

| Command                                  | What it does                                                  |
| ---------------------------------------- | ------------------------------------------------------------- |
| `npm run dev`                            | Dev server with hot reload. **Drafts are visible here only.** |
| `npm run build`                          | Production build + RSS feed (what Vercel runs)                |
| `npm run start`                          | Serve the production build locally                            |
| `npm run typecheck`                      | TypeScript check                                              |
| `node scripts/generate-brand-assets.mjs` | Re-create logo, favicons and avatar                           |

> **Windows note:** Contentlayer prints "might not work as expected on Windows". You can ignore it; dev and build both work. Vercel builds on Linux.

---

## Step 2: Where things live

```
techtoolhub/
├── data/
│   ├── blog/                         ← ✍️  ARTICLES: one .mdx file per article
│   │   ├── chatgpt-review.mdx        →  /blog/chatgpt-review
│   │   ├── best-ai-writing-tools.mdx →  /blog/best-ai-writing-tools
│   │   └── _templates/               ←  2 starter templates (draft: true, never deployed)
│   │       ├── product-review-template.mdx
│   │       └── top-10-listicle-template.mdx
│   ├── pages/                        ← 📄 STANDARD PAGES: file name = URL
│   │   ├── about.mdx                 →  /about
│   │   ├── contact.mdx               →  /contact
│   │   ├── privacy-policy.mdx        →  /privacy-policy
│   │   ├── terms.mdx                 →  /terms
│   │   ├── affiliate-disclosure.mdx  →  /affiliate-disclosure
│   │   ├── how-we-review.mdx         →  /how-we-review
│   │   └── disclaimer.mdx            →  /disclaimer
│   ├── authors/default.mdx           ← byline / author profile
│   ├── siteMetadata.js               ← ⚙️  site name, URL, email, socials, AdSense config
│   ├── headerNavLinks.ts             ← primary navigation
│   └── categories.ts                 ← AI Tools / Developer Tools / Productivity
├── public/static/images/             ← 🖼️  article images (reference as /static/images/x.png)
├── components/
│   ├── mdx/                          ← review components used inside MDX
│   ├── AdSense.tsx                   ← reusable <AdSense /> unit
│   ├── PostExplorer.tsx              ← search + category / format / tag filter
│   └── ArticleCard.tsx
├── layouts/PostLayout.tsx            ← article page (verdict box, TOC, ad slots, related posts)
├── app/                              ← routes: home, categories, /reviews, /blog, sitemap, robots, OG images
└── lib/                              ← JSON-LD builders, post helpers, OG image renderer
```

**Routes:** `/` · `/ai-tools` · `/developer-tools` · `/productivity` · `/reviews` (every `format: review`) · `/blog` (all articles, filterable) · `/tags/<tag>` · the pages above · `/sitemap.xml` · `/robots.txt` · `/ads.txt` · `/feed.xml`

### Publishing an article

1. Copy a template from `data/blog/_templates/` to `data/blog/your-slug.mdx`.
2. Fill in the frontmatter and content. Set `draft: false`.
3. Preview with `npm run dev`, then `git commit` + `git push`. Vercel rebuilds automatically.

### Frontmatter reference

```yaml
title: 'Notion AI Review (2026): Worth It?' # required (≈ 50–60 chars for Google)
date: '2026-10-24' # required
lastmod: '2026-11-02' # shows "Updated …" + dateModified in JSON-LD
summary: 'One or two sentences…' # required: meta description + card text (≈ 150 chars)
category: ai-tools # required: ai-tools | developer-tools | productivity
format: review # review | listicle | comparison | guide | news
tags: ['ai writing', 'notion']
rating: 4.5 # reviews: score out of 5
verdict: 'One-line bottom line' # shown on cards + verdict box
product: # reviews: powers the Review / SoftwareApplication JSON-LD
  name: Notion AI
  url: https://example.com/?ref=you
  price: '$10/month'
  priceCurrency: USD
  platforms: 'Web, macOS, Windows'
  appCategory: BusinessApplication
featured: true # homepage "Editor's picks"
affiliate: true # shows the affiliate disclosure notice
images: ['/static/images/notion-ai-cover.jpg'] # optional 16:9 cover; otherwise a branded cover is generated
authors: ['default']
draft: false
```

### MDX components (no import needed)

| Component                                                                        | Use for                                                                                   |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `<ProsCons pros={[...]} cons={[...]} />`                                         | Pros & cons boxes                                                                         |
| `<Verdict rating={4.5} bestFor="..." ctaText="..." ctaHref="...">text</Verdict>` | Final verdict box with score gauge                                                        |
| `<RatingBadge rating={4.5} />` · `<Stars rating={4.5} />`                        | Inline rating badges                                                                      |
| `<ScoreBreakdown scores={{ 'Ease of use': 4.5 }} />`                             | Per-criterion score bars                                                                  |
| `<SpecsTable specs={{ Developer: '...', 'Free plan': 'Yes' }} />`                | Key specs card                                                                            |
| `<ComparisonTable columns={[...]} rows={[[...]]} highlight={1} />`               | Responsive "X vs Y" table (`true`/`false` → ✓/✗). Use `highlightRow={0}` for ranked lists |
| `<ProductCard rank={1} name="..." rating={4.7} ... />`                           | Ranked entry in a Top 10 list                                                             |
| `<CTAButton href="...">Try it</CTAButton>`                                       | Affiliate button (adds `rel="sponsored nofollow"`)                                        |
| `<Callout type="info\|tip\|warning\|success" title="...">`                       | Highlighted note                                                                          |
| `<AdSense placement="inArticle" />`                                              | Manual in-article ad                                                                      |

Plain markdown tables, GitHub alerts (`> [!TIP]`) and fenced code blocks with syntax highlighting also work.

---

## Step 3: Templates

- `data/blog/_templates/product-review-template.mdx`: specs, features, pricing, pros/cons, score breakdown, vs-table, verdict, FAQ.
- `data/blog/_templates/top-10-listicle-template.mdx`: top picks, comparison table, 10 ranked product cards, buying guide, verdict, FAQ.

Both are `draft: true`, so you can preview them locally at `/blog/_templates/...`, but they never go live.

---

## Step 4: Push to GitHub & deploy on Vercel

### 4.1 Create the GitHub repo and push

```bash
cd C:\Users\samee\Documents\tech-review-portal
git add -A
git commit -m "Initial commit: TechToolHub review portal"
gh repo create techtoolhub --public --source=. --remote=origin --push
```

No GitHub CLI? Create an empty repo named `techtoolhub` on github.com, then:

```bash
git remote add origin https://github.com/<your-username>/techtoolhub.git
git push -u origin main
```

### 4.2 Deploy on Vercel (dashboard, recommended)

1. Go to <https://vercel.com/new> → **Import** the `techtoolhub` repo.
2. Framework preset: **Next.js** (auto-detected). Keep the default build command and output.
3. **Project name: `techtoolhub`**. This gives you `https://techtoolhub.vercel.app` (if the name is taken, pick another and update `NEXT_PUBLIC_SITE_URL`).
4. Optional: add environment variables from `.env.example`.
5. Click **Deploy**. Every `git push` to `main` now redeploys automatically, and pull requests get preview URLs (previews are `noindex` automatically).

### 4.2 (alternative) Deploy with the Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link              # create / link the "techtoolhub" project
vercel --prod
```

### 4.3 After the first deploy

1. **Google Search Console** → add the property `https://techtoolhub.vercel.app` → HTML-tag method → put the token in `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` on Vercel → redeploy → verify → submit `https://techtoolhub.vercel.app/sitemap.xml`.
2. **Google AdSense** (apply once you have ~15–20 quality articles plus the About, Contact and Privacy pages, which are already built):
   - Set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX` on Vercel and redeploy. That loads the script, the `google-adsense-account` meta tag and `/ads.txt`.
   - Optionally create display ad units and set the `NEXT_PUBLIC_ADSENSE_SLOT_*` variables to fill the top, in-article, bottom, sidebar and home slots. Without slot IDs, turn on **Auto ads** in AdSense.
   - In AdSense → _Privacy & messaging_, enable the free **GDPR consent message** (required for EEA/UK visitors).
   - ⚠️ AdSense usually does **not** approve `*.vercel.app` subdomains. You will need your custom domain first (see below).
3. **Custom domain later:** Vercel → Project → _Settings → Domains_ → add `yourdomain.com`, then set `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` and redeploy. Canonicals, sitemap, OG URLs and JSON-LD all follow automatically.

---

## SEO & performance features

- Fully static pages (SSG) served from Vercel's CDN, self-hosted fonts, ~103 kB shared JS
- `sitemap.xml` (articles, categories, pages, tags) and `robots.txt` (blocks preview deployments)
- Canonical URLs, Open Graph and Twitter cards on every page
- **Dynamic OG images:** a branded 1200×630 card per article (`/og/<slug>`) with category, format and star rating, prerendered at build time
- **JSON-LD:** `WebSite` + `Organization` site-wide; `BlogPosting` + `BreadcrumbList` per article; `Review` with `SoftwareApplication`, `Rating` and `Offer` for reviews
- RSS feeds (`/feed.xml` and per tag), `rel="sponsored"` on affiliate links, draft pages `noindex`
- Security headers + CSP preconfigured for AdSense and Google Analytics

## License

MIT. The original starter is © Timothy Lin. See `LICENSE`.
