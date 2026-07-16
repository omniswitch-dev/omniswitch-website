import React from 'react';
import './index.css';

const endpoints = [
  {
    method: 'POST', path: '/v1/chat/completions',
    description: 'OpenAI-style chat completions with optional SSE streaming. Routing, budgets, cache isolation, and guardrails apply to every request.',
    details: ['Headers: Authorization: Bearer <sentinel-api-key> when auth is enabled.', 'Optional routing headers: x-sentinel-provider and x-sentinel-shadow-provider.', 'Trace headers: x-sentinel-trace-id and x-sentinel-session-id.'],
    example: `curl http://localhost:8080/v1/chat/completions \\
  -H "Authorization: Bearer $SENTINEL_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello!"}]}'`
  },
  {
    method: 'POST', path: '/v1/responses',
    description: 'OpenAI Responses compatibility for the non-streaming text/message subset.',
    details: ['Supports model, string or message-array input, instructions, temperature, max_output_tokens, and top_p.', 'Streaming, tools, background mode, and other advanced Responses features are not implemented.']
  },
  {
    method: 'POST', path: '/v1/messages',
    description: 'Core Anthropic Messages compatibility through the same provider-neutral chat pipeline.',
    details: ['Supports model, messages, system, max_tokens, temperature, and top_p.', 'Streaming and Anthropic tool use are not implemented.']
  },
  {
    method: 'POST', path: '/v1/embeddings',
    description: 'OpenAI-compatible embeddings for OpenAI and compatible custom providers.',
    details: ['Requires model and input; optional encoding_format, dimensions, and user are forwarded.', 'Input budget and guardrail checks apply; providers without embeddings support are skipped in a fallback chain.']
  },
  {
    method: 'GET', path: '/v1/models',
    description: 'Lists models registered through native adapters, provider aliases, and compatible custom providers.',
    details: ['Use GET /api/providers for both provider names and exposed models.']
  },
  {
    method: 'POST', path: '/mcp',
    description: 'HTTP JSON-RPC MCP gateway for policy-controlled tool access.',
    details: ['With configured targets, tools/list federates namespaced target__tool entries and tools/call dispatches to the owner.', 'The implementation currently does not support stdio, SSE/streamable HTTP, OAuth delegation, or A2A.']
  },
  {
    method: 'GET', path: '/api/metrics and /metrics',
    description: 'Gateway aggregates and Prometheus text metrics.',
    details: ['Use /api/metrics?window=1h|6h|7d|30d and /api/metrics/providers for JSON dashboards.', 'Prometheus is exposed at /metrics when enabled; with auth enabled it requires a viewer role or higher.']
  }
];

export default function ApiReference() {
  return (
    <div className="api-container">
      <div className="api-header">
        <h1>API Reference</h1>
        <p>OpenAI-compatible chat, compatibility endpoints, embeddings, and a governed MCP gateway.</p>
      </div>

      <div className="api-endpoints">
        {endpoints.map((endpoint) => (
          <div className="endpoint-card" key={endpoint.path}>
            <div className="endpoint-header">
              <span className={`method ${endpoint.method.toLowerCase()}`}>{endpoint.method}</span>
              <span className="path">{endpoint.path}</span>
            </div>
            <p className="endpoint-desc">{endpoint.description}</p>
            <ul className="api-list">
              {endpoint.details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
            {endpoint.example && (
              <div className="code-block api-code"><pre><code>{endpoint.example}</code></pre></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
