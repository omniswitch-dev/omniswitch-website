import React, { useState } from 'react';
import { CheckCircle2, XCircle, Shield, ArrowRight, Layers, Zap, Activity, Cpu, Key, HelpCircle } from 'lucide-react';

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
    omniswitch: { status: 'yes', detail: 'Fully unified API across text, vision, audio, and embeddings with OpenAI compatibility.' },
    portkey: { status: 'yes', detail: 'Universal REST/SDK across text, vision, audio, and custom assistant schemas.' },
    agentgateway: { status: 'yes', detail: 'OpenAI-compatible routing to major public and local provider backends.' }
  },
  {
    area: 'Provider Coverage',
    category: 'gateway',
    desc: 'Support for cloud providers (OpenAI, Anthropic, Gemini) and local tools (Ollama, vLLM).',
    omniswitch: { status: 'yes', detail: 'Native OpenAI, Anthropic, Google, Groq, plus any custom OpenAI-compatible endpoint.' },
    portkey: { status: 'yes', detail: 'Extensive provider catalog, managed virtual key rotation, and custom hosts.' },
    agentgateway: { status: 'yes', detail: 'OpenAI, Anthropic, Gemini, Bedrock, Vertex AI, and native custom targets.' }
  },
  {
    area: 'Routing & Request Shaping',
    category: 'gateway',
    desc: 'Fallbacks, weighted variants, conditions, retries, timeouts, and parameter control.',
    omniswitch: { status: 'yes', detail: 'Fallbacks, weighted variants, CEL conditions, retry/backoff, timeouts, circuit breaking, shadow routing, and overrides.' },
    portkey: { status: 'yes', detail: 'Config-driven load balancing, fallbacks, retries, timeouts, canaries, conditions, and request overrides.' },
    agentgateway: { status: 'yes', detail: 'Failover, load balancing, policy-based routing, and inference-aware Kubernetes scheduling.' }
  },
  {
    area: 'Caching & Budgets',
    category: 'gateway',
    desc: 'Cost controls and reusing safe responses.',
    omniswitch: { status: 'yes', detail: 'Exact and semantic SQLite cache isolated by API key or workspace; per-key cost/token budgets and rate limits.' },
    portkey: { status: 'yes', detail: 'Simple/semantic caching plus configurable cost, token, and time-window limits.' },
    agentgateway: { status: 'yes', detail: 'Budget/spend controls and rate limiting; semantic caching is not a primary documented data-plane feature.' }
  },
  {
    area: 'Guardrails',
    category: 'security',
    desc: 'Input/output enforcement and auditability.',
    omniswitch: { status: 'yes', detail: 'Local PII, injection, SQL, toxic-content, secret-leakage, and regex checks with deny/redact/warn actions.' },
    portkey: { status: 'yes', detail: 'Deterministic, AI/partner, webhook guardrails and actions that can deny, log, retry, or reroute.' },
    agentgateway: { status: 'yes', detail: 'Regex, OpenAI moderation, Bedrock Guardrails, Model Armor, and custom webhook policies.' }
  },
  {
    area: 'Authentication & Authorization',
    category: 'security',
    desc: 'Identity, tenant boundaries, and control-plane access.',
    omniswitch: { status: 'yes', detail: 'Full support for JWT/OIDC/OAuth, mTLS, CEL RBAC, encrypted vault, and workspace scoping.' },
    portkey: { status: 'yes', detail: 'Managed project/workspace controls and API-key governance.' },
    agentgateway: { status: 'yes', detail: 'JWT, API keys, OAuth, TLS, and CEL authorization policies.' }
  },
  {
    area: 'Observability & Prompts',
    category: 'ops',
    desc: 'Logs, metrics, tracing, feedback, and prompt workflows.',
    omniswitch: { status: 'yes', detail: 'Hosted logs, analytics, OpenTelemetry, feedback, prompt versioning, and runtime rendering.' },
    portkey: { status: 'yes', detail: 'Hosted logs, analytics, OpenTelemetry, feedback, prompt library, experiments, and release workflows.' },
    agentgateway: { status: 'yes', detail: 'OpenTelemetry metrics/logs/traces and agent/protocol telemetry; route-level prompt enrichment.' }
  },
  {
    area: 'MCP Gateway',
    category: 'protocols',
    desc: 'Tool discovery, federation, credential handling, and policy enforcement.',
    omniswitch: { status: 'yes', detail: 'Built-in HTTP and stdio MCP federation, policy-gated tools, OpenAPI conversion, and OAuth.' },
    portkey: { status: 'yes', detail: 'Remote MCP server connectivity through its gateway platform.' },
    agentgateway: { status: 'yes', detail: 'MCP federation across stdio, HTTP, SSE, and streamable HTTP, with OpenAPI integration and OAuth.' }
  },
  {
    area: 'Agent-to-Agent (A2A)',
    category: 'protocols',
    desc: 'Native discovery and task communication between agents.',
    omniswitch: { status: 'yes', detail: 'Native identity protocols and direct A2A routing support via the proxy data plane.' },
    portkey: { status: 'no', detail: 'Not a documented first-class gateway protocol.' },
    agentgateway: { status: 'yes', detail: 'Native A2A connectivity, capability discovery, modality negotiation, and collaboration.' }
  },
  {
    area: 'Deployment & High Availability',
    category: 'ops',
    desc: 'Operational model and scale-out infrastructure.',
    omniswitch: { status: 'yes', detail: 'Shared database, config hot reload, HA control plane, and zero external dependencies (Go binary).' },
    portkey: { status: 'yes', detail: 'Hosted platform plus self-hosted gateway options.' },
    agentgateway: { status: 'yes', detail: 'Standalone and Kubernetes control-plane/data-plane deployment with Gateway API integration.' }
  }
];

export default function Comparison() {
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
      
      {/* Section below for any additional boundaries removed to save space and match the cleaner narrative */}
    </div>
  );
}
