# Website claims map

Reviewed 2026-10-29. The public site has five pages: Home, Quickstart, Documentation, API reference, and Security. Comparison, marketing, roadmap, and benchmark pages are retired with permanent redirects.

Product prose and the source-build quickstart use the official product repository at `5df77bbb1852ac02faa92ce8fcfffca2bcabe6dc`. The latest published release checked on this date is v0.1.0; the v0.2.0 publication flag remains false. The quickstart explicitly uses pinned development source.

| Published content                                                                               | Primary source                                                        |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Single Go binary, self-hosting, SQLite, Apache-2.0                                              | Product `README.md`, `LICENSE`                                        |
| LLM routing, fallbacks, retries, guardrails, keys, budgets, MCP tools, Prometheus and OTLP      | Product `README.md`, `docs/CONFIGURATION.md`, `docs/OBSERVABILITY.md` |
| Go 1.26 requirement and official repository source build                                        | Product `go.mod`, `README.md` at the pinned commit                    |
| Local authenticated gateway, provider environment key, API-key cache scope, payload logging off | Product `README.md`, `docs/CONFIGURATION.md`                          |
| Model endpoints, documented Responses/Messages subsets, MCP and basic agent discovery           | Product `README.md`, `docs/API.md`                                    |
| Private vulnerability reporting, reporting email, hardening guidance                            | Product `SECURITY.md`, `docs/DEPLOYMENT.md`                           |

No performance rankings, customer statistics, certification promises, or complete API parity claims are published. Full technical scope lives in the linked product documentation.

The comparison register below remains internal provenance for the existing verification tooling. It is no longer rendered on public pages and has not been edited or reinterpreted in this redesign.

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
