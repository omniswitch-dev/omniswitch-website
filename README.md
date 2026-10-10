# OmniSwitch website

The public site for [OmniSwitch](https://github.com/omniswitch-dev/omniswitch): secure self-hosted control first, universal AI routing second, governed MCP/A2A infrastructure third.

React 19 + Vite 8. Every production route is prerendered with React's `react-dom/static`; React hydrates the static HTML for client-side navigation. There is no router, CMS, or SSR runtime dependency. System fonts, an HTML architecture diagram, and finite, reduced-motion-aware animations keep the site lightweight.

## Develop and check

Use Node 24 and npm (matching CI).

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

The development server is on port 5173. Keep its `server.host` and `allowedHosts` settings in place for the shared development preview. Development uses `createRoot`; production uses `hydrateRoot`.

```sh
npm run format:check     # readable source; use npm run format to apply
npm test                 # oxlint + Node unit tests
npm run claims:check     # immutable register, pin, digest, generated prose
npm run build            # client → SSR → prerender → static checks
npm run preview          # http://127.0.0.1:4173
```

`preview` serves the built route files with clean paths, gzip negotiation, immutable hashed assets, a 308 `/comparison` redirect, and a genuine 404 response for unknown paths. It does not use a SPA fallback. Use `-- --host 0.0.0.0 --port 4173` when an external preview proxy needs to reach it.

The static check validates all route files, unique titles/descriptions/canonicals/social images/JSON-LD, one H1, dated WebPages, internal links and anchors, banned marketing language, 1200×630 social images, and a JavaScript budget strictly below 150 KB gzip. It also reruns the claims check. CI runs on push and pull request with Node 24, `npm ci`, the formatting check, `npm test`, the claims check, and the full build.

Prettier uses 100-column lines, single quotes, and no semicolons. Run `npm run format` before committing new code. Generated claims, social images, lockfiles, and build output are excluded; the generated register block in `CLAIMS.md` is protected by formatter ignore markers. Keep nested JSX readable, with clear component boundaries.

## Claims: one source, no hand edits

Every comparison cell comes from `docs/comparison/claims.yaml` in the product repository. `src/data/claims.json` is generated; `src/data/claims-pin.json` records the immutable commit and source SHA-256. `CLAIMS.md` contains the prose-to-source map and a generated provenance block.

Fetch a committed register (new commits default to `omniswitch-dev/omniswitch`):

```sh
npm run claims:sync -- --commit <full-product-commit> --repo <owner/omniswitch>
```

For local, unpushed product work, extract an exact git blob rather than editing the copy:

```sh
git -C ../omniswitch show <full-product-commit>:docs/comparison/claims.yaml > /var/tmp/omniswitch-claims.yaml
npm run claims:sync -- --from /var/tmp/omniswitch-claims.yaml --commit <full-product-commit> --repo <owner/omniswitch>
npm run claims:check
```

A bare check uses the existing pin's repository. It reads the immutable blob from a matching sibling product checkout when available, otherwise GitHub raw. On CI the pinned product commit must be reachable publicly; push/merge that product work before expecting website CI to fetch it.

The dependency-free parser deliberately supports only this register's flat scalar/list YAML schema. It rejects duplicate fields, invalid status/qualifier values, unknown IDs, and unsupported YAML constructs rather than guessing. `self-hosted` and `token-rate-limits` are optional while the product register is upgraded. A missing or `unknown` cell is **Not verified**, never Not available. Empty evidence URLs remain visible evidence gaps; the UI links provenance without inventing a source.

States are Supported, Beta, Enterprise only, Managed only, Partial, Not available, and Not verified. Partial scope is visible inline; native evidence disclosures work without JavaScript. Qualifiers come from the register, not editorial overrides.

When editing prose:

1. Verify the fact against code or dated first-party evidence.
2. Update its `CLAIMS.md` row.
3. Sync only if the product register changed. Do not patch generated cells.
4. Run tests and the full build.

No scores or provider totals, invented benchmark/customer numbers, certification promises, full API parity, or A2A/token-exchange exclusivity. The current lexical similarity cache is not described as embedding-based caching. Published component measurements and cited register benchmark records are scoped evidence, not a cross-gateway ranking.

## Routes, social images, and deployment

- `src/routes.jsx`: routes, metadata, dates, and page components. Includes `/compare` and six competitor pages.
- `src/pages/`: homepage, comparisons, and documentation-style pages.
- `src/components/`: shared layout, real links, native menu/evidence disclosures, code panels, and status/source components.
- `src/styles/`: design tokens and finite motion.
- `src/seo.js`: escaped per-route metadata and JSON-LD; client navigation updates them too.
- `src/entry-server.jsx` and `scripts/prerender.mjs`: static route rendering, 404, sitemap, robots, and route manifest.
- `src/data/compare/`: grouping and dated editorial fit/context/source data; never cell statuses.
- `src/data/release.json`: publication flag, version, source-evaluation path, and install/run facts.

Generate the committed route social images after changing titles or adding routes:

```sh
npm run og
npm run build
```

The added dependencies, `@resvg/resvg-js` for social images and Prettier for readable source, are development-only. Production serves static files from `dist/`; it needs neither Node nor the SSR bundle. Prerendering removes `dist/.server`. `vercel.json` enables clean URLs, no trailing slashes, a permanent `/comparison` → `/compare` redirect, and immutable caching for hashed assets. There is **no catch-all rewrite**. Other hosts must map clean paths to the generated `route/index.html` and serve `404.html` with status 404, not rewrite everything to the homepage.

Analytics and Speed Insights start after mount only on the production `omniswitch.dev` / `www.omniswitch.dev` hosts. They are suppressed on development and preview hosts. Google Fonts and the old raster console mockup are removed.

## Manual release gates

See [the local verification report](docs/WEBSITE_VERIFICATION.md) for measured results, browser
coverage, and the remaining integration/publication gates.

The initial register pin intentionally preserves known source errors: the older native-adapter count, OpenAPI-to-MCP status, A2A detail, Responses/Messages scope, and competitor evidence gaps. Re-sync the corrected release register before publication. Do not turn those source errors into local overrides.

`release.json.published` stays **false** until the tag and its artifacts actually exist. Quickstart and Install show pinned source-evaluation commands, not a fictional beta download. Future download verification uses `checksums.txt.sig` / `checksums.txt.pem`, keyless `cosign verify-blob`, checksum verification, and `gh attestation verify` on the archive. Confirm the workflow identity and signing asset names against the actual release.

Run these bounded read-only checks manually (not in CI):

```sh
npm run check:links       # external HEAD/GET review; report-only
npm run check:release     # release/assets, installer, versioned GHCR image, Homebrew formula
```

A missing target release makes `check:release` fail; that is expected while preparing an unpublished release. It never changes the publication flag. A 403/429/timeout during external link review is unverified rather than evidence of absence. Product provenance links can return 404 before the corresponding commit is pushed.

Before merging the website:

- Re-pin to the corrected, publicly reachable product release commit and rerun all checks.
- Verify the actual archives, signature/certificate, provenance, image tag, and tap; only then set `published: true` and rebuild.
- Review `/`, `/compare`, a competitor page, Quickstart, Docs, and 404 at 1440 and 390 px; test direct navigation, keyboard focus, native evidence/menu interactions, no-JavaScript HTML, and reduced motion.
- Run Lighthouse against the production preview; target 90+ Performance, Accessibility, and SEO for home and compare.
- Confirm Vercel deep-link, 308, and true-404 behavior on the deployment preview.
- Add only real redesigned console screenshots when supplied, with explicit sample-data captions. There are no placeholders.

The older upstream website PR on `codex/gateway-website-alignment` is superseded by this rebuild; recommend closing it rather than merging it. Public pushes, PRs, tags, releases, and production deployment belong to the release integrator/user, not this build stream.
