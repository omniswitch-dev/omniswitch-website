import React, { useState } from 'react';
import { CheckCircle2, XCircle, Shield, HelpCircle } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Features' },
  { id: 'gateway', name: 'Gateway & Routing' },
  { id: 'security', name: 'Security & Guardrails' },
  { id: 'ops', name: 'Observability & Prompts' },
  { id: 'protocols', name: 'MCP & Agent Protocols' }
];

const comparisonData = [
  {
    area: 'Unified Inference API',
    category: 'gateway',
    desc: 'Unifies API requests across different cloud and local LLM backends.',
    omniswitch: { status: 'partial', detail: '/v1/chat/completions, /v1/models, a text subset of /v1/responses, a core subset of /v1/messages, /v1/embeddings, /v1/rerank, and local /v1/moderations.' },
    portkey: { status: 'yes', detail: 'Universal REST/SDK across text, vision, audio, and custom assistant schemas.' },
    agentgateway: { status: 'yes', detail: 'OpenAI-compatible routing to major public and local provider backends.' }
  },
  {
    area: 'Provider Coverage',
    category: 'gateway',
    desc: 'Support for cloud providers (OpenAI, Anthropic, Gemini) and local tools (Ollama, vLLM).',
    omniswitch: { status: 'partial', detail: 'Native OpenAI, Anthropic, Google, Groq, Azure OpenAI, AWS Bedrock, and Cohere adapters; one-env-var presets for Mistral, DeepSeek, xAI, Together, Fireworks, Perplexity, Cerebras, and OpenRouter; any OpenAI-compatible custom endpoint. No native Vertex AI adapter yet.' },
    portkey: { status: 'yes', detail: 'Extensive provider catalog, managed virtual key rotation, and custom hosts.' },
    agentgateway: { status: 'yes', detail: 'OpenAI, Anthropic, Gemini, Bedrock, Vertex AI, and native custom targets.' }
  },
  {
    area: 'Routing & Request Shaping',
    category: 'gateway',
    desc: 'Fallbacks, weighted variants, conditions, retries, timeouts, and parameter control.',
    omniswitch: { status: 'yes', detail: 'Fallbacks, weighted variants, CEL conditions, retry/backoff, timeouts, circuit breaking, shadow routing, and default/override/drop parameter shaping.' },
    portkey: { status: 'yes', detail: 'Config-driven load balancing, fallbacks, retries, timeouts, canaries, conditions, and request overrides.' },
    agentgateway: { status: 'yes', detail: 'Failover, load balancing, policy-based routing, and inference-aware Kubernetes scheduling.' }
  },
  {
    area: 'Caching & Budgets',
    category: 'gateway',
    desc: 'Cost controls and reusing safe responses.',
    omniswitch: { status: 'partial', detail: 'Exact + semantic SQLite cache isolated by key/workspace/organization/global. Per-key cost/token budgets and local sliding-window rate limits, plus optional Redis-coordinated fixed windows; no token-based limiter yet.' },
    portkey: { status: 'yes', detail: 'Simple/semantic caching plus configurable cost, token, and time-window limits.' },
    agentgateway: { status: 'yes', detail: 'Budget/spend controls and rate limiting; semantic caching is not a primary documented data-plane feature.' }
  },
  {
    area: 'Guardrails',
    category: 'security',
    desc: 'Input/output enforcement and auditability.',
    omniswitch: { status: 'partial', detail: 'Local PII, injection, SQL, toxic-content, secret-leakage, and regex checks with deny/redact/warn/log actions, plus HTTP webhook connectors and structured audit events. No native Bedrock/Model Armor connector, and no guardrail-triggered retry/fallback yet.' },
    portkey: { status: 'yes', detail: 'Deterministic, AI/partner, webhook guardrails and actions that can deny, log, retry, or reroute.' },
    agentgateway: { status: 'yes', detail: 'Regex, OpenAI moderation, Bedrock Guardrails, Model Armor, and custom webhook policies.' }
  },
  {
    area: 'Authentication & Authorization',
    category: 'security',
    desc: 'Identity, tenant boundaries, and control-plane access.',
    omniswitch: { status: 'partial', detail: 'Hashed API keys, bootstrap owner, OIDC JWT/JWKS identity, CEL allow/deny policies, fixed role gates, workspace scope, and an encrypted vault. OAuth is available for explicitly delegated MCP OIDC bearer tokens; no mTLS, SAML, or SCIM yet.' },
    portkey: { status: 'yes', detail: 'Managed project/workspace controls and API-key governance.' },
    agentgateway: { status: 'yes', detail: 'JWT, API keys, OAuth, TLS, and CEL authorization policies.' }
  },
  {
    area: 'Observability & Prompts',
    category: 'ops',
    desc: 'Logs, metrics, tracing, feedback, and prompt workflows.',
    omniswitch: { status: 'partial', detail: 'SQLite logs with per-request trace waterfalls, feedback, prompt templates/versions/rendering, OTLP export (Langfuse/Jaeger/Tempo), and Prometheus metrics. No external log store, and no prompt approval, rollback, or experiments yet.' },
    portkey: { status: 'yes', detail: 'Hosted logs, analytics, OpenTelemetry, feedback, prompt library, experiments, and release workflows.' },
    agentgateway: { status: 'yes', detail: 'OpenTelemetry metrics/logs/traces and agent/protocol telemetry; route-level prompt enrichment.' }
  },
  {
    area: 'MCP Gateway',
    category: 'protocols',
    desc: 'Tool discovery, federation, credential handling, and policy enforcement.',
    omniswitch: { status: 'partial', detail: 'HTTP federation with streamed SSE/streamable-HTTP, persistent stdio targets, server-side headers, OIDC bearer delegation, tools/list, and policy-gated tools/call. No OpenAPI-to-MCP conversion in the stable API yet.' },
    portkey: { status: 'yes', detail: 'Remote MCP server connectivity through its gateway platform.' },
    agentgateway: { status: 'yes', detail: 'MCP federation across stdio, HTTP, SSE, and streamable HTTP, with OpenAPI integration and OAuth.' }
  },
  {
    area: 'Agent-to-Agent (A2A)',
    category: 'protocols',
    desc: 'Native discovery and task communication between agents.',
    omniswitch: { status: 'partial', detail: 'Public A2A v1 Agent Card discovery plus authenticated JSON-RPC SendMessage and GetExtendedAgentCard, routed through the full gateway pipeline. No task lifecycle, streaming, push notifications, or outbound A2A client yet.' },
    portkey: { status: 'no', detail: 'Not a documented first-class gateway protocol.' },
    agentgateway: { status: 'yes', detail: 'Native A2A connectivity, capability discovery, modality negotiation, and collaboration.' }
  },
  {
    area: 'Deployment & High Availability',
    category: 'ops',
    desc: 'Operational model and scale-out infrastructure.',
    omniswitch: { status: 'partial', detail: 'Config hot-reload (routes, guardrails, cache posture, circuit breaker, shadow routing) with no restart; Redis-coordinated rate limiting across replicas; single Go binary; Kustomize manifests. Keys and logs remain SQLite-local — no shared database or HA control plane yet.' },
    portkey: { status: 'yes', detail: 'Hosted platform plus self-hosted gateway options.' },
    agentgateway: { status: 'yes', detail: 'Standalone and Kubernetes control-plane/data-plane deployment with Gateway API integration.' }
  }
];

export default function Comparison({ navigate }) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredData = activeTab === 'all' 
    ? comparisonData 
    : comparisonData.filter(d => d.category === activeTab);

  return (
    <div className="api-container">
      <div className="api-header reveal active">
        <div className="section-badge">Comparison</div>
        <h1>OmniSwitch vs. Portkey vs. AgentGateway</h1>
        <p className="docs-intro" style={{ textAlign: 'center', maxWidth: '650px', margin: '0.5rem auto 2rem' }}>
          An objective capability map of open-source and enterprise AI gateway solutions to help you pick the right stack.
        </p>
      </div>

      <div className="code-tabs" style={{ justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {categories.map(c => (
          <span 
            key={c.id} 
            className={`code-tab ${activeTab === c.id ? 'active' : ''}`}
            onClick={() => setActiveTab(c.id)}
          >
            {c.name}
          </span>
        ))}
      </div>

      <div className="reveal active" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredData.map((row, idx) => (
          <div key={idx} className="endpoint-card" style={{ borderLeft: '3px solid var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'white', fontFamily: 'Outfit' }}>{row.area}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{row.desc}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: 'rgba(142, 45, 226, 0.04)', border: '1px solid rgba(142, 45, 226, 0.15)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Shield size={16} style={{ color: 'var(--accent-light)' }} />
                  <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'white' }}>OmniSwitch</span>
                  <div style={{ marginLeft: 'auto' }}>
                    {row.omniswitch.status === 'yes' && <CheckCircle2 size={16} style={{ color: '#10b981' }} />}
                    {row.omniswitch.status === 'partial' && <HelpCircle size={16} style={{ color: '#f59e0b' }} />}
                    {row.omniswitch.status === 'no' && <XCircle size={16} style={{ color: '#ef4444' }} />}
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#c0c0c0', lineHeight: '1.5' }}>{row.omniswitch.detail}</p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Portkey</span>
                  <div style={{ marginLeft: 'auto' }}>
                    {row.portkey.status === 'yes' && <CheckCircle2 size={16} style={{ color: '#10b981', opacity: 0.8 }} />}
                    {row.portkey.status === 'partial' && <HelpCircle size={16} style={{ color: '#f59e0b', opacity: 0.8 }} />}
                    {row.portkey.status === 'no' && <XCircle size={16} style={{ color: '#ef4444', opacity: 0.6 }} />}
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{row.portkey.detail}</p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>AgentGateway</span>
                  <div style={{ marginLeft: 'auto' }}>
                    {row.agentgateway.status === 'yes' && <CheckCircle2 size={16} style={{ color: '#10b981', opacity: 0.8 }} />}
                    {row.agentgateway.status === 'partial' && <HelpCircle size={16} style={{ color: '#f59e0b', opacity: 0.8 }} />}
                    {row.agentgateway.status === 'no' && <XCircle size={16} style={{ color: '#ef4444', opacity: 0.6 }} />}
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{row.agentgateway.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <p className="bench-fnotes" style={{ marginTop: '2rem' }}>
        <HelpCircle size={14} style={{ verticalAlign: 'text-bottom', marginRight: '0.3rem' }} />
        OmniSwitch column verified 2026-09-11 against the OmniSwitch <code>main</code> branch (README.md and docs/PORTKEY_COMPARISON.md).
        "Partial" means real, shipped functionality with named gaps — see the detail text on each card. Competitor columns are summarized
        from each project's public documentation and were not independently re-verified. See the{' '}
        <a href="/benchmarks" onClick={(e) => { e.preventDefault(); if (navigate) navigate('benchmarks'); }}>benchmarks page</a> for performance claims;
        this table is about feature coverage, not speed.
      </p>
    </div>
  );
}
