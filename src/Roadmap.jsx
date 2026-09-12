import React from 'react';

export default function Roadmap() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="section-badge">Roadmap</div>
        <h1>Where OmniSwitch is going</h1>
        <p>Mirrors ROADMAP.md in the repository, plus the beta scope and explicit deferrals from the launch plan. Roadmap
        items are not commitments — they exist to help contributors find useful places to push.</p>
      </div>

      <div className="page-section">
        <h2>Shipped</h2>
        <ul className="docs-list">
          <li>Config hot-reload: routes, guardrails, cache posture, circuit breaker, shadow provider (no restart).</li>
          <li>Per-request trace waterfalls persisted with logs and rendered in the dashboard.</li>
          <li>Rust-accelerated guardrail scanning via embedded WASM, with a pure-Go fallback.</li>
          <li>Release automation: GoReleaser binaries, GHCR multi-arch images, Homebrew tap refresh.</li>
          <li>CI hardening: golangci-lint, race detector, coverage, CodeQL.</li>
        </ul>
      </div>

      <div className="page-section">
        <h2>Near term</h2>
        <ul className="docs-list">
          <li>Shared storage or external control-plane support for horizontally scaled key, log, budget, and config state.</li>
          <li>SAML/mTLS identity options on top of the current API key and OIDC/JWKS model.</li>
          <li>OpenAPI-to-MCP conversion and richer MCP OAuth client flows.</li>
          <li>Prompt rollback and playground workflows on top of the current prompt version API.</li>
          <li>Guardrail retry, reroute, and fallback actions after policy violations.</li>
          <li>Dashboard cost charts and eval report views.</li>
          <li>MCP spec conformance pass (stateless servers, <code>_meta</code> trace context propagation).</li>
          <li>One native MCP OAuth provider integration (Keycloak or Auth0).</li>
        </ul>
      </div>

      <div className="page-section">
        <h2>Medium term</h2>
        <ul className="docs-list">
          <li>Evaluation datasets and model-quality simulations on top of the current policy replay endpoint.</li>
          <li>Visual policy and routing editor.</li>
          <li>Fuller A2A task lifecycle, streaming, push notifications, and outbound agent calls.</li>
          <li>Image, audio, batch, and file endpoints.</li>
          <li>Postgres storage driver option alongside SQLite.</li>
        </ul>
      </div>

      <div className="page-section">
        <h2>Long term</h2>
        <ul className="docs-list">
          <li>Agent identity registry.</li>
          <li>Multi-agent execution graph observability.</li>
          <li>Compliance evidence reports.</li>
          <li>Policy marketplace and signed policy bundles.</li>
        </ul>
      </div>

      <div className="page-section">
        <h2>Beta scope and explicit deferrals</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
          Deliberately out of scope for the 2–4 week public beta window, tracked for after launch:
        </p>
        <ul className="docs-list">
          <li>Image/TTS/transcription HTTP endpoints; full Responses API and Anthropic Messages tool parity.</li>
          <li>A2A push notifications and an outbound A2A client.</li>
          <li>SAML/SCIM/mTLS; multi-writer HA control plane; a token-based rate limiter.</li>
          <li>Visual policy/config editor; agent identity registry; evals UI beyond policy replay.</li>
          <li>Kubernetes controller/CRDs and a Kubernetes benchmark tier; a public Go SDK; Windows arm64.</li>
          <li>Managed-service latency numbers on the benchmarks page; Artifact Hub listing.</li>
          <li>apt/rpm/Scoop/winget packaging; a Terraform module; GenAI OTel semantic conventions.</li>
          <li>A docs-site framework with search; contributor ladder and a monthly community call.</li>
        </ul>
      </div>

      <div className="page-section" style={{ textAlign: 'center' }}>
        <a className="btn-secondary" href="https://github.com/omniswitch-dev/omniswitch/blob/main/ROADMAP.md" target="_blank" rel="noreferrer">
          Read ROADMAP.md
        </a>
      </div>
    </div>
  );
}
