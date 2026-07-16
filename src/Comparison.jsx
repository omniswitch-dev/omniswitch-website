import React, { useState } from 'react';
import { CheckCircle2, XCircle, Shield, Layers, Zap, HelpCircle } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Features' },
  { id: 'gateway', name: 'Gateway & Routing' },
  { id: 'security', name: 'Security & Guardrails' },
  { id: 'ops', name: 'Observability & Prompts' },
  { id: 'protocols', name: 'MCP & Agent Protocols' }
];

const comparisonData = [
  {
    area: 'Unified Inference API', category: 'gateway',
    desc: 'Unified entry points for model inference and provider selection.',
    omniswitch: { status: 'partial', detail: 'Chat completions, models, embeddings, plus non-streaming Responses text/message and core Anthropic Messages compatibility.' },
    portkey: { status: 'yes', detail: 'Universal REST/SDK API across a broad model and multimodal endpoint surface.' },
    agentgateway: { status: 'yes', detail: 'OpenAI-compatible routing for cloud and local LLM provider backends.' }
  },
  {
    area: 'Provider Coverage', category: 'gateway',
    desc: 'Native provider adapters and compatible endpoint support.',
    omniswitch: { status: 'partial', detail: 'Native OpenAI, Anthropic, Google, and Groq; any OpenAI-compatible custom endpoint. No native Bedrock, Vertex, or Cohere adapter.' },
    portkey: { status: 'yes', detail: 'Large provider/model catalog, virtual keys, and custom-host configuration.' },
    agentgateway: { status: 'yes', detail: 'Major cloud providers, including OpenAI, Anthropic, Gemini, Bedrock, plus custom backends.' }
  },
  {
    area: 'Routing & Request Shaping', category: 'gateway',
    desc: 'Fallbacks, weighted variants, conditions, retries, timeouts, and parameter control.',
    omniswitch: { status: 'yes', detail: 'Fallbacks, weighted variants, CEL conditions, retry/backoff/status codes, per-attempt timeouts, circuit breaking, shadow routing, defaults/overrides/drops.' },
    portkey: { status: 'yes', detail: 'Config-driven load balancing, fallbacks, retries, timeouts, canaries, conditions, and request overrides.' },
    agentgateway: { status: 'yes', detail: 'Failover, load balancing, policy-based routing, and inference-aware Kubernetes scheduling.' }
  },
  {
    area: 'Caching & Budgets', category: 'gateway',
    desc: 'Cost controls and reusing safe responses.',
    omniswitch: { status: 'partial', detail: 'Exact and semantic SQLite cache isolated by API key, workspace, organization, or explicit global scope; per-key cost/token budgets and local request limits.' },
    portkey: { status: 'yes', detail: 'Simple/semantic caching plus configurable cost, token, and time-window limits.' },
    agentgateway: { status: 'yes', detail: 'Budget/spend controls and rate limiting; semantic caching is not a primary documented data-plane feature.' }
  },
  {
    area: 'Guardrails', category: 'security',
    desc: 'Input/output enforcement and auditability.',
    omniswitch: { status: 'partial', detail: 'Local PII, injection, SQL, toxic-content, secret-leakage, and regex checks with deny/redact/warn/log actions and buffered stream enforcement.' },
    portkey: { status: 'yes', detail: 'Deterministic, AI/partner, webhook guardrails and actions that can deny, log, retry, or reroute.' },
    agentgateway: { status: 'yes', detail: 'Regex, OpenAI moderation, Bedrock Guardrails, Model Armor, and custom webhook policies.' }
  },
  {
    area: 'Authentication & Authorization', category: 'security',
    desc: 'Identity, tenant boundaries, and control-plane access.',
    omniswitch: { status: 'partial', detail: 'Hashed API keys, bootstrap owner, viewer/member/admin/owner gates, workspace scope, and encrypted provider vault. No JWT/OIDC/OAuth/mTLS or CEL RBAC.' },
    portkey: { status: 'yes', detail: 'Managed project/workspace controls and API-key governance.' },
    agentgateway: { status: 'yes', detail: 'JWT, API keys, OAuth, TLS, and CEL authorization policies.' }
  },
  {
    area: 'Observability & Prompts', category: 'ops',
    desc: 'Logs, metrics, tracing, feedback, and prompt workflows.',
    omniswitch: { status: 'partial', detail: 'SQLite logs, traces/sessions, feedback, OTLP export, Prometheus, prompt versions and rendering. Raw payload logs are opt-in; no trace waterfall, experiments, or releases.' },
    portkey: { status: 'yes', detail: 'Hosted logs, analytics, OpenTelemetry, feedback, prompt library, experiments, and release workflows.' },
    agentgateway: { status: 'yes', detail: 'OpenTelemetry metrics/logs/traces and agent/protocol telemetry; route-level prompt enrichment.' }
  },
  {
    area: 'MCP Gateway', category: 'protocols',
    desc: 'Tool discovery, federation, credential handling, and policy enforcement.',
    omniswitch: { status: 'partial', detail: 'HTTP JSON-RPC target federation for tools/list and policy-gated tools/call; namespaced tools and server-side credentials. No stdio, SSE/streamable HTTP, OpenAPI conversion, or OAuth.' },
    portkey: { status: 'yes', detail: 'Remote MCP server connectivity through its gateway platform.' },
    agentgateway: { status: 'yes', detail: 'MCP federation across stdio, HTTP, SSE, and streamable HTTP, with OpenAPI integration and OAuth.' }
  },
  {
    area: 'Agent-to-Agent (A2A)', category: 'protocols',
    desc: 'Native discovery and task communication between agents.',
    omniswitch: { status: 'no', detail: 'Not implemented.' },
    portkey: { status: 'no', detail: 'Not a documented first-class gateway protocol.' },
    agentgateway: { status: 'yes', detail: 'Native A2A connectivity, capability discovery, modality negotiation, and collaboration.' }
  },
  {
    area: 'Deployment & High Availability', category: 'ops',
    desc: 'Operational model and scale-out infrastructure.',
    omniswitch: { status: 'partial', detail: 'Self-hosted Go process with local SQLite and a local rate limiter. No shared database, config hot reload, or HA control plane.' },
    portkey: { status: 'yes', detail: 'Hosted platform plus self-hosted gateway options.' },
    agentgateway: { status: 'yes', detail: 'Standalone and Kubernetes control-plane/data-plane deployment with Gateway API integration.' }
  }
];

export default function Comparison() {
  const [activeTab, setActiveTab] = useState('all');
  const filteredData = activeTab === 'all' ? comparisonData : comparisonData.filter((row) => row.category === activeTab);

  return (
    <div className="api-container">
      <div className="api-header reveal active">
        <div className="section-badge">Comparison</div>
        <h1>OmniSwitch vs. Portkey vs. AgentGateway</h1>
        <p className="docs-intro" style={{ textAlign: 'center', maxWidth: '650px', margin: '0.5rem auto 2rem' }}>
          A capability map that separates implemented options from partial coverage and planned work.
        </p>
      </div>

      <div className="code-tabs" style={{ justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {categories.map((category) => (
          <span key={category.id} className={`code-tab ${activeTab === category.id ? 'active' : ''}`} onClick={() => setActiveTab(category.id)}>
            {category.name}
          </span>
        ))}
      </div>

      <div className="reveal active" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredData.map((row) => <ComparisonCard key={row.area} row={row} />)}
      </div>

      <div className="reveal active" style={{ marginTop: '4rem', background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '2.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: 'white', fontFamily: 'Outfit', marginBottom: '1rem' }}>Practical Boundaries</h3>
        <p style={{ color: '#c0c0c0', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.7' }}>
          OmniSwitch focuses on the self-hosted gateway baseline: safe cache tenancy, API-key roles, declarative routing, deterministic guardrails, compatibility endpoints, and HTTP MCP federation. It is well suited to a single-process deployment that keeps data local, but is not a drop-in replacement for the larger protocol, cloud-provider, and control-plane surfaces of Portkey or AgentGateway.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Zap size={18} style={{ color: 'var(--cyan)' }} /> When to choose OmniSwitch</h4>
            <ul className="docs-list" style={{ fontSize: '0.85rem' }}>
              <li>You want local storage and self-hosted control over inference traffic.</li>
              <li>You need provider routing, cache isolation, budgets, and deterministic guardrails in one process.</li>
              <li>You need governed HTTP MCP tool federation without adding another data plane.</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Layers size={18} style={{ color: 'var(--accent-light)' }} /> Largest remaining gaps</h4>
            <ul className="docs-list" style={{ fontSize: '0.85rem' }}>
              <li>Shared storage and distributed rate limiting for HA deployments.</li>
              <li>JWT/OIDC/mTLS, CEL authorization, and external/webhook guardrails.</li>
              <li>Streamable/stdio MCP, OAuth delegation, A2A, and native Bedrock/Vertex/Cohere endpoints.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonCard({ row }) {
  return (
    <div className="endpoint-card" style={{ borderLeft: '3px solid var(--accent)' }}>
      <h3 style={{ fontSize: '1.25rem', color: 'white', fontFamily: 'Outfit' }}>{row.area}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{row.desc}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        <Capability name="OmniSwitch" icon={<Shield size={16} style={{ color: 'var(--accent-light)' }} />} capability={row.omniswitch} highlight />
        <Capability name="Portkey" capability={row.portkey} />
        <Capability name="AgentGateway" capability={row.agentgateway} />
      </div>
    </div>
  );
}

function Capability({ name, icon, capability, highlight = false }) {
  const statusIcon = capability.status === 'yes'
    ? <CheckCircle2 size={16} style={{ color: '#10b981' }} />
    : capability.status === 'partial'
      ? <HelpCircle size={16} style={{ color: '#f59e0b' }} />
      : <XCircle size={16} style={{ color: '#ef4444' }} />;
  return (
    <div style={{ background: highlight ? 'rgba(142, 45, 226, 0.04)' : 'rgba(255, 255, 255, 0.01)', border: highlight ? '1px solid rgba(142, 45, 226, 0.15)' : '1px solid var(--glass-border)', padding: '1rem', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {icon}<span style={{ fontWeight: highlight ? '700' : '600', fontSize: '0.85rem', color: highlight ? 'white' : 'var(--text-secondary)' }}>{name}</span>
        <div style={{ marginLeft: 'auto' }}>{statusIcon}</div>
      </div>
      <p style={{ fontSize: '0.8rem', color: highlight ? '#c0c0c0' : 'var(--text-secondary)', lineHeight: '1.5' }}>{capability.detail}</p>
    </div>
  );
}
