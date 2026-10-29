# OmniSwitch website

A focused product site for the [OmniSwitch AI gateway](https://github.com/omniswitch-dev/omniswitch).

React 19 + Vite 8. Five public pages—Home, Quickstart, Documentation, API reference, and Security—are prerendered at build time, then hydrated for client navigation. Production serves static files from `dist/`.

The light neutral design uses a compact routing symbol, charcoal typography, and violet accents. The mark is a small native SVG, with transparent PNG and wordmark assets in `public/brand/`. It is shared by the header, footer, favicon, and social cards.

## Development

Use Node 24 and npm, matching CI.

```sh
npm ci
npm run dev -- --host 0.0.0.0
npm run format:check
npm test
npm run claims:check
npm run og
npm run build
npm run preview
```

The build checks metadata, structured data, internal links, anchors, social cards, retired-page redirects, and the JavaScript budget. System fonts and static SVGs keep the page assets small. Analytics run only on the production OmniSwitch domains.

## Content and routes

- `src/pages/`: the five current pages and 404.
- `src/routes.jsx`: route metadata and dates.
- `src/data/redirects.json`: retired URLs and their current destinations.
- `public/brand/`: reusable logo assets.
- `scripts/prerender.mjs`: page HTML, redirects, sitemap, and robots.

Old marketing, roadmap, benchmark, comparison, and install URLs redirect to useful current content. Vercel and the static preview use permanent HTTP redirects; other static hosts have small HTML redirect fallbacks. Retired URLs stay out of the sitemap.

## Product facts

The quickstart builds an immutable source commit from the official product repository and uses its Go requirement. It does not advertise the target v0.2.0 as a published release. Product capabilities link to first-party technical guides, rather than duplicating a long manual on the website.

`CLAIMS.md` records published prose sources. The older comparison register and validation tools remain as internal provenance; comparison data is excluded from the public client bundle. Never hand-edit generated claims or change release publication state without verifying the product artifacts.

## Deployment

Vercel builds on repository pushes. `vercel.json` declares clean URLs, permanent redirects, and caching for hashed assets. Preserve true 404 responses; do not add a catch-all rewrite. Changes are prepared on a review branch before production integration.
