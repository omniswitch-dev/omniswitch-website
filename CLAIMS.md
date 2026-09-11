# Claims map

Every marketing sentence on this site should trace to something in the [omniswitch](https://github.com/omniswitch-dev/omniswitch)
repository. This file is the audit trail for that mapping. Update it whenever you add or change a claim in
`index.html`, `src/App.jsx`, `src/Comparison.jsx`, `src/Docs.jsx`, `src/ApiReference.jsx`, or the beta-specific
pages (`Quickstart`, `Install`, `Benchmarks`, `Security`, `Community`, `Roadmap`, `Changelog`).

Audited: 2026-09-11, against `omniswitch` repo `main` branch (README.md, ROADMAP.md, docs/API.md,
docs/PORTKEY_COMPARISON.md, SECURITY.md, BENCHMARKS.md, CHANGELOG.md).

## Site-wide / meta

| Claim | Location | Source |
| --- | --- | --- |
| "Self-hosted, open-source AI gateway" | `index.html` meta/OG/Twitter, hero | README.md intro |
| "One OpenAI-compatible base URL" | `index.html`, hero | docs/API.md — `/v1/chat/completions` etc. are OpenAI request/response shapes |
| "Provider fallbacks, local guardrails, budgets, caching, request tracing" | `index.html`, hero, features grid | README.md feature bullets |
| `softwareVersion: 0.2.0-beta` (JSON-LD) | `index.html` | CHANGELOG.md `[0.2.0-beta.1] - Unreleased` |
| "Public beta" badge | announcement bar, `/docs`, `/quickstart` | This site is the public-beta launch (plan Track C) |
| Removed: fabricated `aggregateRating` JSON-LD | `index.html` | No review/rating system exists in the product; this was invented, not sourced. Deleted. |

## Homepage (`src/App.jsx`)

| Claim | Source |
| --- | --- |
| "1 binary · SQLite built in · Redis optional" | README.md — single Go binary, SQLite storage, Redis only for distributed rate limits |
| "7 + any native adapters + OpenAI-compatible" | README.md: "Native OpenAI, Anthropic, Google, Groq, Azure, Bedrock, and Cohere adapters" (7) + "any OpenAI-compatible custom endpoint" |
| "Apache-2.0 · no enterprise fork" | LICENSE, README.md |
| Provider strip native vs. preset split | README.md provider-routing bullet, verbatim list of native adapters vs. one-env-var presets |
| Quickstart 3-step commands | docs/API.md base URL / auth header conventions; `omniswitch serve`, `docker compose up -d` from install docs; YAML route/fallback fields from docs/CONFIGURATION.md and docs/PORTKEY_COMPARISON.md config sample |
| Status board (stable/beta/not-yet) | `src/data/status.json`, sourced from README.md, ROADMAP.md, docs/PORTKEY_COMPARISON.md — see that file's `source`/`updated` fields |
| Benchmarks teaser: "no cross-gateway run yet", guardrail micro-benchmark numbers | `src/data/benchmarks.json` (`state: "pending"`) and BENCHMARKS.md (Rust-WASM vs Go guardrail scan timings) |
| Community CTAs (beta feedback template, good-first-issue, Discussions) | `.github/ISSUE_TEMPLATE/beta-feedback.yml` and `.github/ISSUE_TEMPLATE/config.yml` (added in the parallel community/governance workstream) |
| Removed: 13 modules / 8 native providers / 0 dependencies / 100% self-hosted hero stats | These were either uncheckable ("0 dependencies" when Redis/Postgres are real optional integrations) or arbitrary module counts. Replaced with the four facts above, each traceable to a doc. |
| Removed: home-page inline comparison table (all-true booleans vs. Portkey/AgentGateway) | That table asserted 20 capabilities as fully "yes" for OmniSwitch with no partial state and no footnote. Replaced with a link to `/comparison`, which has partial statuses and a footnote (see below). |
| "About" page: "No Required External Services" (was "Zero Dependencies... No Redis, Postgres...") | README.md — Redis is an optional, real integration (distributed rate limiting); a Postgres storage driver is in development per CHANGELOG.md `[Unreleased]`. The old wording contradicted both. |

## `/comparison` (`src/Comparison.jsx`)

All OmniSwitch-column rows are sourced from `docs/PORTKEY_COMPARISON.md`, cross-checked against README.md where
the two docs disagreed (README.md is the newer document by git history — 2026-08-25 vs. an earlier
PORTKEY_COMPARISON.md revision — so it wins on provider-adapter counts). Every OmniSwitch row is `partial` except
"Routing & Request Shaping", which docs/PORTKEY_COMPARISON.md itself marks "Implemented (core)" without caveats
strong enough to downgrade.

- Removed the "Full support for JWT/OIDC/OAuth, mTLS, CEL RBAC..." claim. docs/PORTKEY_COMPARISON.md states
  explicitly: "OAuth is available for explicitly delegated MCP OIDC bearer tokens; no mTLS." There is no mTLS
  support. Corrected to name the real auth surface and the gap (no mTLS/SAML/SCIM).
- Provider Coverage row: docs/PORTKEY_COMPARISON.md says "No native Bedrock/Vertex/Cohere adapter yet," but
  README.md (newer) lists Azure, Bedrock, and Cohere as native adapters. Followed README.md; flagged the
  remaining real gap (no Vertex AI adapter) instead.
- Added a footnote: "OmniSwitch column verified 2026-09-11 against the OmniSwitch main branch... Competitor
  columns are summarized from each project's public documentation and were not independently re-verified,"
  plus a link to `/benchmarks` so readers don't conflate this feature-coverage table with a performance claim.

## `/api` (`src/ApiReference.jsx`)

| Claim | Fix / Source |
| --- | --- |
| "100% compatible with the OpenAI specification" | Softened to name the actually-compatible endpoints (chat completions, embeddings, models, rerank) and call out Responses/Messages as documented subsets, per docs/API.md and `src/data/status.json`. |
| `GET /.well-known/agent.json` | Corrected to `GET /.well-known/agent-card.json` — confirmed exact path via `grep` in docs/API.md line 72. |

## `/docs` (`src/Docs.jsx`)

Added `<BetaBadge>` and `<KnownLimitations>` (from `src/BetaNotice.jsx`) so the beta caveats (single-replica
SQLite control plane, Responses/Messages subsets, A2A scope limits, no mTLS/SAML/SCIM, guardrail stream
buffering, semantic cache caveat) are visible on the main docs entry point, matching the status board.

## `/benchmarks` (`src/Benchmarks.jsx`, `src/data/benchmarks.json`)

`state: "pending"` — no cross-gateway harness run exists yet. The page:

- Does not invent a scheduled date, a harness repo name, or comparison numbers for gateways not yet run.
- Publishes the one real number available: the guardrail-scanning micro-benchmark from BENCHMARKS.md, labelled
  with its actual (laptop-class) environment, not the pinned benchmark rig the eventual cross-gateway run will use.
- States the methodology (v1, frozen 2026-09-11) and caveats up front, so methodology isn't retrofitted after
  results exist.
- Is structured (`state` field) so a future `results.json` / `state: "published"` can drive a published-state
  renderer without a page rewrite. `PublishedBenchmarks` in `Benchmarks.jsx` is a stub for that later phase.

## `/security` (`src/Security.jsx`)

Summarizes the rewritten `SECURITY.md` from the parallel community/governance workstream: supported-versions
table, private reporting via GitHub Security Advisories, SLA table, and the out-of-scope list (`auth: false`,
`cache_scope: global`, `log_payloads: true`, host access required). No claim on this page states a threshold that
isn't in the linked `SECURITY.md`.

## `/roadmap` (`src/Roadmap.jsx`)

Mirrors ROADMAP.md's Shipped/Near-term/Medium-term/Long-term sections plus an explicit "Beta scope and
deferrals" section listing what will not ship in the beta window.

## `/community` (`src/Community.jsx`)

Links to real repo scaffolding added in the parallel workstream: `.github/ISSUE_TEMPLATE/beta-feedback.yml`,
`good-first-issue` label search, GitHub Discussions, and internal `/security` link for vulnerability reports.
The "office hours" card explicitly states no slot is live yet — this is not a claim of an existing recurring
call.

## `/changelog` (`src/Changelog.jsx`)

Content summarized directly from CHANGELOG.md `[0.2.0-beta.1]` and `[0.1.0]` sections; links out to GitHub
Releases for the authoritative list.

## Known open question

README.md and docs/PORTKEY_COMPARISON.md disagree on native provider adapter count (7 vs. 4, re: Azure/Bedrock/
Cohere). This site follows README.md as the newer document. If a maintainer confirms PORTKEY_COMPARISON.md is
actually current and README.md is aspirational, the Provider Coverage row in `/comparison`, the hero fact
"7 + any", and the providers strip on the homepage all need to be revisited together.
