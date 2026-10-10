# Website claims map

The website leads with secure self-hosted control, then universal AI routing, then governed agent infrastructure. Prose must trace to code or dated first-party documentation. Comparisons must use the pinned product register; never change a cell by hand.

Reviewed 2026-10-09 against the release foundation `a8a594b` and the approved v0.2.0 release plan. v0.2.0 is **not published**. Planned release changes are labelled unreleased until the product stream and release checks finish.

## Homepage and shared layout

| Prose claim / proof line                                                                                                                                       | Source                                                                                                              | Verified       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------- |
| Self-hosted control plane; keep keys, local guardrails, budgets and request traces in your infrastructure                                                      | `README.md`, `internal/gateway/`, `internal/store/`                                                                 | 2026-10-09     |
| One Go binary; binary, Docker, Kubernetes                                                                                                                      | `cmd/gateway/`, `Dockerfile`, `deploy/`, `.goreleaser.yaml`                                                         | 2026-10-09     |
| SQLite built in; Redis optional for shared rate limits (not shared control state)                                                                              | `internal/store/`, `internal/gateway/ratelimit_redis.go`, `examples/gateway-config.yaml`                            | 2026-10-09     |
| Apache-2.0; open source; no hosted cloud control plane required                                                                                                | `LICENSE`, `README.md`, `cmd/gateway/`                                                                              | 2026-10-09     |
| Example architecture: Authenticate → Guard → Route → Observe                                                                                                   | `internal/gateway/`, `internal/guardrail/`, `internal/router/`, `internal/telemetry/`                               | 2026-10-09     |
| Example config `auth: true`, `cache_scope: api_key`, `log_payloads: false`                                                                                     | `examples/gateway-config.yaml`                                                                                      | 2026-10-09     |
| Hashed gateway API keys, roles, workspace boundaries, budgets and request limits                                                                               | `internal/store/`, `internal/gateway/middleware.go`, `internal/gateway/gateway.go`                                  | 2026-10-09     |
| Local PII, injection and secret checks; regex; deny and redact actions                                                                                         | `internal/guardrail/`, `examples/gateway-config.yaml`                                                               | 2026-10-09     |
| SQLite request logs, guardrail events, Prometheus and OTLP                                                                                                     | `internal/store/`, `internal/dashboard/dashboard.go`, `internal/telemetry/`                                         | 2026-10-09     |
| OpenAI-compatible chat client with a gateway `base_url` and Bearer gateway key                                                                                 | `docs/API.md`, `internal/gateway/gateway.go`, `internal/gateway/middleware.go`                                      | 2026-10-09     |
| Seven native adapters: OpenAI, Anthropic, Google Gemini, Groq, Azure OpenAI, AWS Bedrock, Cohere                                                               | `internal/provider/{openai,anthropic,google,groq,azure,bedrock,cohere}.go`, `cmd/gateway/main.go` at `a8a594b`      | 2026-10-09     |
| Custom OpenAI-compatible endpoints, including Ollama and vLLM; Responses/Messages documented subsets                                                           | `internal/provider/custom.go`, `internal/gateway/compat.go`, `docs/API.md`                                          | 2026-10-09     |
| Fallbacks, retries, per-attempt timeouts, weighted routes, CEL conditions and config hot reload                                                                | `internal/router/`, `internal/gatewayconfig/`, `README.md`                                                          | 2026-10-09     |
| MCP federation and tool-call policy over HTTP/SSE and persistent stdio; Beta                                                                                   | `internal/proxy/`, `internal/policy/`, `internal/gatewayconfig/config.go`                                           | 2026-10-09     |
| A2A: SendMessage, SendMessageStream (SSE task events), GetTask, best-effort CancelTask; tasks in memory; no push notifications; no downstream agent proxy      | `internal/gateway/a2a.go`, `internal/gateway/a2a_tasks.go`                                                          | 2026-10-09     |
| Public beta boundaries; SQLite single replica; no dashboard SSO/admin audit trail, mTLS, SAML or SCIM; lexical similarity cache; streaming guardrail buffering | `docs/KNOWN_LIMITATIONS.md`, `internal/cache/cache.go`, `internal/gateway/`, approved release plan deferred section | 2026-10-09     |
| Homepage comparison teaser                                                                                                                                     | Generated register below; same cells as `/compare`                                                                  | Register dates |

## Route claims

| Route / prose scope                                                                                                                                             | Source                                                                                                                      | Verified                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `/quickstart`, `/install`: unpublished source-build path, `omniswitch serve`, auth on, health/readiness probes                                                  | `src/data/release.json`, `cmd/gateway/cli.go`, `cmd/gateway/main.go` at `a8a594b`, `examples/gateway-config.yaml`           | 2026-10-09                  |
| `/install`: future archive names without `v` prefix; verify checksums with cosign and GitHub attestations only when published                                   | `.goreleaser.yaml`, `.github/workflows/release.yml`, `docs/RELEASES.md`, approved v0.2.0 supply-chain plan                  | 2026-10-09; conditional     |
| `/docs`: authentication, configuration, routing, local guardrails, budgets, provider vault, MCP, A2A, telemetry, deployment                                     | `docs/{CONFIGURATION,API,OBSERVABILITY,DEPLOYMENT}.md`, gateway/router/proxy/store code                                     | 2026-10-09                  |
| `/api`: documented endpoint scope and gateway header names; Responses and Messages remain subsets; future multimodal APIs explicitly unreleased                 | `docs/API.md`, `internal/gateway/{gateway,embeddings,compat,a2a}.go`, approved release plan                                 | 2026-10-09                  |
| `/api`: `x-omniswitch-model` is an A2A selector; `x-omniswitch-cache` is a HIT/MISS response header; isolation uses `gateway.cache_scope`, not a request header | `internal/gateway/{gateway,a2a}.go`, `internal/gatewayconfig/config.go`                                                     | 2026-10-09                  |
| `/security`: supported versions, reporting contact, response targets, out-of-scope choices, hardening; no certification or identity-completeness promise        | `SECURITY.md`, `docs/DEPLOYMENT.md`, `docs/KNOWN_LIMITATIONS.md`                                                            | 2026-10-09                  |
| `/changelog`: v0.2.0 release scope is unreleased; v0.1.0 date                                                                                                   | `CHANGELOG.md`, approved v0.2.0 release plan                                                                                | 2026-10-09                  |
| `/roadmap`: implemented capabilities derive from OmniSwitch `yes` rows; remaining work labelled planned                                                         | Generated register, approved release plan deferred section                                                                  | Register dates / 2026-10-09 |
| `/community`: repository, Discussions, issues, contributing and private reporting links; no member counts or testimonials                                       | `.github/`, `CONTRIBUTING.md`, `SECURITY.md`                                                                                | 2026-10-09                  |
| `/benchmarks`: pending cross-gateway results; frozen methodology and published guardrail microbenchmarks, with environment/caveats                              | `bench/`, `BENCHMARKS.md`, `src/data/benchmarks.json`                                                                       | 2026-10-09                  |
| `/about`: self-hosted control first, gateway second, agent protocols third; Apache-2.0 and repository maintainers                                               | `README.md`, `LICENSE`, repository contributors                                                                             | 2026-10-09                  |
| `/compare` and six detail pages: every capability cell                                                                                                          | Generated register; no local edits, scores, or speed claims                                                                 | Register dates              |
| Migration starting points: OpenAI SDK `base_url` change for chat where both register rows are `yes`; no header compatibility or automated config/key import     | `docs/API.md`, generated `openai-compatible-chat` rows, dated competitor header docs in `competitors.json`                  | 2026-10-09                  |
| Fit guidance and edition/licensing context                                                                                                                      | First-party source URLs and access dates in `src/data/compare/competitors.json`                                             | 2026-10-09                  |
| Helicone joined Mintlify on 3 March 2026; service maintenance commitment                                                                                        | https://www.helicone.ai/blog/joining-mintlify                                                                               | 2026-10-09                  |
| Palo Alto Networks completed the Portkey acquisition on 29 May 2026                                                                                             | https://www.paloaltonetworks.com/company/press/2026/palo-alto-networks-completes-acquisition-of-portkey-to-secure-ai-agents | 2026-10-09                  |
| Envoy AI Gateway renamed Agent Router in v1.2.0 on 6 October 2026; distinct from AgentGateway                                                                   | https://theagentrouter.ai/release-notes/                                                                                    | 2026-10-09                  |

## Release review blockers

The initial register retains known outdated OmniSwitch adapter-count, OpenAPI-to-MCP and A2A details, older Responses/Messages scope, and competitor evidence gaps. Optional `self-hosted`, `token-rate-limits` and `qualifier` fields have not landed. The UI preserves source claims rather than disguising these errors. Re-sync from the corrected release commit before launch. The A2A scope notice next to every relevant table supplies the precise current protocol boundaries without modifying register details.

The old raster console mockup and fabricated social proof are removed. Real console screenshots are a separate deliverable and are not represented by placeholders.

Migration pilots are limited to chat: select the model in the JSON body. The A2A-only
`x-omniswitch-model` selector is not included in the chat header mapping (`internal/gateway/a2a.go`
and `internal/gateway/gateway.go` at the pinned foundation; reviewed 2026-10-09).

<!-- prettier-ignore-start -->

<!-- claims:register:start -->

## Generated comparison register

- Repository: https://github.com/chiragkumarkakwani-ctrl/omniswitch
- Register: https://github.com/chiragkumarkakwani-ctrl/omniswitch/blob/a8a594b1f29b5fa7fec4ba04afa88cf86ceeed46/docs/comparison/claims.yaml
- Pinned commit: `a8a594b1f29b5fa7fec4ba04afa88cf86ceeed46`
- Synced on: 2026-10-09
- Gateways: `omniswitch`, `litellm`, `litellm-rust`, `portkey-oss`, `helicone`, `kong-ai-gateway`, `envoy-ai-gateway`, `cloudflare-ai-gateway`, `portkey-cloud`, `helicone-cloud`, `kong-konnect`
- Rows: 429; yes 131, partial 22, no 50, unknown 226.

Cells are copied without local status or detail overrides. Empty capability-source URLs link to the pinned register and are labelled as an evidence gap. Missing optional capabilities render Not verified.

<!-- claims:register:end -->

<!-- prettier-ignore-end -->
