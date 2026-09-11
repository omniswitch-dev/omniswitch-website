import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Changelog() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="section-badge">Changelog</div>
        <h1>What changed, and when</h1>
        <p>Full release notes live on GitHub Releases. This page is a human-curated summary; see CHANGELOG.md in the
        repository for the complete list.</p>
      </div>

      <div className="page-section" style={{ textAlign: 'center' }}>
        <a className="btn-primary" href="https://github.com/omniswitch-dev/omniswitch/releases" target="_blank" rel="noreferrer">
          GitHub Releases <ExternalLink size={16} />
        </a>
      </div>

      <div className="page-section">
        <h2>0.2.0-beta.1 — first public beta</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
          Focused on making the install and first-run path trustworthy, filling agent-protocol and storage gaps from
          0.1.0, and standing up community/security scaffolding ahead of the public announcement.
        </p>
        <ul className="docs-list">
          <li>PostgreSQL shared-state storage driver, provider presets, MCP trace-context propagation, and a Helm chart.</li>
          <li>OpenAPI-to-MCP conversion, a <code>bench</code> tool, and a proxy-overhead micro-benchmark.</li>
          <li>A2A v1 task lifecycle (create, poll, cancel) with SSE streaming for task updates.</li>
          <li>Guardrail fallback reroute action and automatic retries for guardrail webhook calls.</li>
          <li>MCP OAuth token exchange (RFC 8693) with RFC 7523 JWT Bearer Grant support.</li>
          <li>Evals/experiments framework with dataset management on top of the policy replay endpoint.</li>
          <li>First-run reliability: MCP disabled by default, embedded fallback policy, real CLI subcommands
          (<code>version</code>, <code>validate-config</code>, <code>--help</code>), and <code>/healthz</code>/<code>/readyz</code> endpoints.</li>
          <li>Community, governance, and security scaffolding: SECURITY.md, SUPPORT.md, GOVERNANCE.md, MAINTAINERS.md,
          CODEOWNERS, Dependabot, a beta-feedback issue form, and an install-verification workflow.</li>
        </ul>
      </div>

      <div className="page-section">
        <h2>0.1.0 — 2026-08-24</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>First tagged release.</p>
        <ul className="docs-list">
          <li>OpenAI-compatible AI gateway with streaming chat completions.</li>
          <li>Provider adapters for OpenAI, Anthropic, Google Gemini, and Groq, plus a generic OpenAI-compatible
          custom provider for Azure OpenAI, Ollama, vLLM, and similar endpoints.</li>
          <li>Encrypted provider credential vault, exact/semantic SQLite caching, circuit breakers, retries,
          fallbacks, and shadow routing.</li>
          <li>Responses, Anthropic Messages, embeddings, rerank, and local moderation compatibility endpoints.</li>
          <li>MCP federation over HTTP/SSE and stdio; A2A Agent Card discovery and JSON-RPC SendMessage.</li>
          <li>OIDC/JWKS workload identity and CEL allow/deny authorization rules.</li>
        </ul>
      </div>
    </div>
  );
}
