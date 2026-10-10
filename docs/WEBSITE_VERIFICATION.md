# Website verification — v0.2.0 preparation

Verified locally on 2026-10-09. This report covers the website, not gateway feature acceptance or
release publication. No push, pull request, or deployment was performed.

## Implemented scope

- Responsive homepage and shared dark design system, reviewed against all four approved home and
  comparison HTML designs at 1440 and 390 CSS pixels.
- Comparison hub and six competitor pages, rendered from the immutable product register rather
  than hand-maintained capability cells. The hub has eight rows and 56 cells in each layout.
- Quickstart, install, documentation, API, security, community, roadmap, changelog, benchmarks,
  about, and a true not-found page. Current copy explicitly describes v0.2.0 as unpublished.
- Build-time prerendering, client hydration/navigation, per-route metadata and structured data,
  sitemap, robots, and 19 unique 1200×630 social cards.
- Claims provenance/check mode, release facts, banned-language and static-output checks, CI,
  and pinned development-only Prettier 3.9.9. Generated data is excluded from formatting.

Migration pilots link to `/compare/<competitor>#migration`, rather than adding a query-string
variant of quickstart. They do not claim automated import or drop-in header compatibility.
The comparison hub includes guardrails, OTLP export, and license in addition to the five core
design rows. Missing optional register capabilities remain **Not verified**.

## Automated checks

| Check                   | Result                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `npm run format:check`  | Pass                                                                                        |
| `npm test`              | Oxlint: 0 errors/warnings; 16 Node tests pass                                               |
| `npm run claims:check`  | 429 rows match the immutable source and SHA-256 pin                                         |
| `npm run build`         | Client build, SSR, 18 public routes + 404, and static checks pass                           |
| `npm run check:dist`    | Metadata, JSON-LD, social images, internal links/anchors, claims, banned phrases pass       |
| JavaScript gzip budget  | 107.29 KB; strictly below the 150 KB budget                                                 |
| Local HTTP routing      | All 19 route bodies/statuses match generated files; legacy 308 and unknown-route 404 pass   |
| Gzip preview            | GET/HEAD, `Vary`, body round-trip, and `gzip;q=0` checks pass                               |
| `npm run check:links`   | Report-only: 82 of 105 external URLs succeeded; 23 returned 404                             |
| `npm run check:release` | Expected failure while unpublished: release 404, tap not pinned, registry authorization 401 |
| `npm audit`             | 3 transitive findings: 2 high (`nanoid`, `source-map-js`), 1 moderate (`postcss`)           |

Lighthouse 13.5.0 against the gzip static preview, using Chrome 154:

| Page/device       | Performance | Accessibility | SEO |   LCP | CLS |
| ----------------- | ----------: | ------------: | --: | ----: | --: |
| Home / desktop    |         100 |           100 | 100 | 0.4 s |   0 |
| Home / mobile     |         100 |           100 | 100 | 1.5 s |   0 |
| Compare / desktop |         100 |           100 | 100 | 0.4 s |   0 |
| Compare / mobile  |          99 |           100 | 100 | 1.7 s |   0 |

These are local frontend measurements, not gateway latency or throughput benchmarks, and are
not a substitute for checking the actual hosting deployment.

## Browser, accessibility, and no-JavaScript review

- Axe WCAG 2 A/AA: zero violations on home and compare at both widths, and on LiteLLM comparison,
  quickstart, docs, and 404 at desktop width. Incomplete checks remain: gradient/pseudo-element
  contrast and the grouped competitor table. They are not counted as automated passes.
- Manual contrast review checked computed text colors against conservative overlay bounds
  (minimum 5.83:1) and both primary-button gradient endpoints (minimum 5.80:1).
- The LiteLLM table has 41 capability row headers, 123 nonempty data cells, explicit column
  headers, caption, and six named row groups. A dedicated screen-reader session was not run.
- Skip-link order and focus, visible keyboard focus, native disclosures, anchor scrolling,
  route-heading focus, client metadata/JSON-LD updates, back/forward, and copy feedback pass.
- Normal animations finish; reduced-motion mode has no running animations. No horizontal
  overflow appeared at the reviewed widths. Mobile navigation/evidence target geometry is at
  least 44×44 pixels (7 checked controls on home, 124 on compare, including capability disclosures).
- With page JavaScript disabled through CDP, the native menu and comparison evidence/source
  links work. All 56 hub cells match across layouts. Direct home, compare, LiteLLM, quickstart,
  install, docs, API, security, and unknown routes retain readable prerendered content. Copy
  buttons are hidden. No hydration or runtime errors appeared in the JavaScript-enabled checks.
- The existing public static preview returned 200 and rendered the comparison page with its
  stylesheet and hydrated content. Port 5173 remains running; the production-like preview uses
  port 4173. No backend or hosted-auth configuration is needed for this static site.

## Required integration and publication work

1. Integrate and verify the product streams, then publish a reachable product commit. Re-sync
   corrected register data; never patch generated cells. The current pin is `a8a594b`, with
   known outdated A2A/provider/OpenAPI claims and 20 selected source gaps.
2. Resolve the 23 external-link findings: 19 unpublished pin URLs, planned upstream
   `docs/RELEASES.md`, and the Portkey gateway blog, Kong 3.14 blog, and Cloudflare changelog URLs.
   Broken immutable evidence URLs need corrections in the product register, not website overrides.
3. Refresh release facts, source-build instructions, and version-sensitive API/MCP/limits/console
   copy against the integrated product. Confirm archive and signing assets, cosign identity,
   attestation, release tag, versioned container image, installer, and Homebrew formula before
   enabling `published`. Local checks do not establish that the remote release exists.
4. Re-run CI with the public pin and verify clean deep routes, 404 status, redirects, compression,
   and caching on the actual deployment. Vercel behavior has not been exercised by deploying.
5. Real integrated-console screenshots were not available and were not replaced with mock proof.
   Add them only after their data and visible claims are verified. Review transitive dependency
   audit findings separately; no broad dependency upgrades were made in this task.

Recommend treating the older upstream website PR as superseded, without taking action here:
https://github.com/omniswitch-dev/omniswitch-website/pull/1
