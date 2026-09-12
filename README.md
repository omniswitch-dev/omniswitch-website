# omniswitch-website

Marketing/docs site for [OmniSwitch](https://github.com/omniswitch-dev/omniswitch), an open-source, self-hosted
AI gateway. Single-page React app (Vite + React 19) with client-side HTML5-history routing — no router library, no
server-side rendering. Deployed as a static build behind a SPA-friendly host (Netlify/Vercel/any static host with
history-mode fallback).

## Requirements

- Node.js 20+ and npm

## Develop

```bash
npm ci
npm run dev -- --host 0.0.0.0
```

The dev server prints a local URL. Routing is handled in `src/App.jsx` via `pushState`/`popstate`, so every route
renders from `index.html` — no server-side route config is needed in dev.

## Lint

```bash
npm run lint
```

Runs [oxlint](https://oxc.rs). Keep this at zero warnings before committing — unused imports and dead code are
treated as lint failures here.

## Build

```bash
npm run build
```

Outputs a static build to `dist/`. Preview the production build locally with:

```bash
npm run preview
```

## Deploy

The build output in `dist/` is a static SPA. Any static host works as long as it rewrites all paths to
`index.html` (history-mode fallback) so that routes like `/docs` or `/benchmarks` work on a hard refresh or
direct link:

- `public/_redirects` already contains the Netlify-style catch-all rule (`/*    /index.html   200`).
- On other hosts, configure an equivalent SPA fallback (e.g. Vercel's default static rewrite, or an nginx
  `try_files $uri /index.html;`).

Update `public/sitemap.xml` and the JSON-LD block in `index.html` when you add or remove routes.

## Project structure

- `src/App.jsx` — app shell, header/nav/footer, home page sections, and the client-side router.
- `src/Docs.jsx`, `src/ApiReference.jsx`, `src/Comparison.jsx`, `src/Quickstart.jsx`, `src/Install.jsx`,
  `src/Benchmarks.jsx`, `src/Security.jsx`, `src/Community.jsx`, `src/Roadmap.jsx`, `src/Changelog.jsx` — one
  component per route.
- `src/data/status.json` — the stable/beta/not-yet status board content shown on the homepage. Update this on
  every tagged release.
- `src/data/benchmarks.json` — benchmarks page content. Has a `state` field (`"pending"` or `"published"`);
  `src/Benchmarks.jsx` branches on it. Swap this file's content (or point it at a generated `results.json`) once
  the cross-gateway benchmark harness produces a report.
- `src/BetaNotice.jsx` — shared `<BetaBadge>` / `<KnownLimitations>` components used across beta-era pages.

## Claim policy

This site makes product claims (feature coverage, provider list, status of individual modules). Every claim on
the homepage, `/comparison`, and `/benchmarks` should be traceable to a source document in the
[omniswitch](https://github.com/omniswitch-dev/omniswitch) repository (`README.md`, `ROADMAP.md`,
`docs/PORTKEY_COMPARISON.md`, `docs/API.md`, `BENCHMARKS.md`). See `CLAIMS.md` at the repository root for the
current claim-to-source mapping. When a feature is partial or still changing, say so — the status board and the
`partial` comparison-table state exist for this reason.
