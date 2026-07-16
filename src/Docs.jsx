import React from 'react';
import { Terminal, Settings, Shield, Key, Network } from 'lucide-react';
import './index.css';

export default function Docs() {
  return (
    <div className="docs-container">
      <div className="docs-sidebar">
        <h3>Documentation</h3>
        <ul>
          <li><a href="#quickstart" className="active">Quickstart</a></li>
          <li><a href="#configuration">Configuration</a></li>
          <li><a href="#providers">Providers</a></li>
          <li><a href="#guardrails">Guardrails</a></li>
          <li><a href="#mcp">MCP gateway</a></li>
          <li><a href="#vault">Keys and vault</a></li>
        </ul>
      </div>

      <div className="docs-content">
        <h1 className="docs-title">OmniSwitch Documentation</h1>
        <p className="docs-intro">Deploy and configure the self-hosted OmniSwitch AI gateway.</p>

        <section id="quickstart" className="docs-section">
          <h2><Terminal size={24} className="section-icon" /> Quickstart</h2>
          <p>Clone the repository, provide a model-provider credential, and start the Go gateway.</p>

          <div className="code-block">
            <div className="code-header">Terminal</div>
            <pre><code>{`git clone https://github.com/omniswitch-dev/omniswitch
cd omniswitch

SENTINEL_AUTH=true \\
SENTINEL_BOOTSTRAP_API_KEY=replace-with-a-secret-manager-value \\
OPENAI_API_KEY=sk-your-provider-key \\
go run ./cmd/gateway`}</code></pre>
          </div>

          <p>The gateway listens on <code>http://localhost:8080</code>. The first auth-enabled start needs <code>SENTINEL_BOOTSTRAP_API_KEY</code> when the database has no keys; rotate it to a normal owner/admin key after provisioning.</p>
        </section>

        <section id="configuration" className="docs-section">
          <h2><Settings size={24} className="section-icon" /> Configuration</h2>
          <p>Use a declarative YAML or JSON config with <code>SENTINEL_CONFIG</code>. Environment variables override the file, which makes it suitable for GitOps plus secret-manager injection.</p>

          <div className="code-block">
            <div className="code-header">gateway-config.yaml</div>
            <pre><code>{`apiVersion: sentinel.dev/v1
kind: GatewayConfig

gateway:
  listen: ":8080"
  auth: true
  cache_scope: api_key
  log_payloads: false
  cors_origins: [https://app.example.com]
  max_request_bytes: 10485760

guardrails:
  stream_buffer: true
  actions: {injection: deny, pii: redact}

providers:
  - name: openai-prod
    type: openai
    api_key_env: OPENAI_API_KEY

routes:
  production-chat:
    fallbacks: ["@openai-prod"]
    max_retries: 2
    retry_codes: [429, 500, 502, 503, 504]
    timeout: 30s`}</code></pre>
          </div>

          <p>Start it with <code>SENTINEL_CONFIG=gateway-config.yaml go run ./cmd/gateway</code>. Keep <code>cache_scope</code> at <code>api_key</code> unless you intentionally want cache sharing, and keep raw payload logging disabled unless it is approved.</p>
        </section>

        <section id="providers" className="docs-section">
          <h2><Globe size={24} className="section-icon" /> Supported Providers</h2>
          <p>OmniSwitch has native adapters for four providers and can connect to any OpenAI-compatible HTTP endpoint through <code>custom</code>.</p>

          <ul className="docs-list">
            <li><strong>OpenAI:</strong> <code>type: openai</code> (chat and embeddings).</li>
            <li><strong>Anthropic:</strong> <code>type: anthropic</code> for chat completions.</li>
            <li><strong>Google Gemini:</strong> <code>type: google</code> for chat completions.</li>
            <li><strong>Groq:</strong> <code>type: groq</code> for chat completions.</li>
            <li><strong>Compatible endpoints:</strong> <code>type: custom</code> for Azure OpenAI, Ollama, vLLM, DeepSeek, Together AI, and similar OpenAI-compatible services.</li>
          </ul>
        </section>

        <section id="guardrails" className="docs-section">
          <h2><Shield size={24} className="section-icon" /> Guardrails</h2>
          <p>Built-in deterministic checks inspect inputs and outputs for prompt injection, SQL patterns, PII, toxic content, and likely secret leakage. Add regular-expression rules at the <code>input</code>, <code>output</code>, or <code>both</code> stage.</p>
          <ul className="docs-list">
            <li><strong>Enforcement:</strong> <code>deny</code> blocks a request or completion; <code>redact</code> replaces matching output.</li>
            <li><strong>Audit-only actions:</strong> <code>warn</code> and <code>log</code> create structured guardrail audit events without storing the prompt or completion.</li>
            <li><strong>Streaming safety:</strong> buffered SSE output checks are on by default; disabling the buffer lowers first-token latency but trusts provider output.</li>
          </ul>
        </section>

        <section id="mcp" className="docs-section">
          <h2><Network size={24} className="section-icon" /> MCP Gateway</h2>
          <p>Configure HTTP JSON-RPC MCP targets to federate <code>tools/list</code> and policy-gated <code>tools/call</code> through a single <code>/mcp</code> endpoint. Tools are namespaced as <code>target__tool</code>; target credentials are configured server-side and are never taken from the caller.</p>
          <p>The current gateway supports HTTP MCP federation. Stdio, SSE/streamable HTTP, OAuth delegation, OpenAPI conversion, and A2A are not available yet.</p>
        </section>

        <section id="vault" className="docs-section">
          <h2><Key size={24} className="section-icon" /> Keys and Credential Vault</h2>
          <p>Sentinel API keys use viewer, member, admin, and owner roles. Inference and MCP requests accept valid keys; management endpoints require roles appropriate to the operation. Non-admin dashboard views are scoped to their own key.</p>
          <p>The virtual-provider vault encrypts provider credentials at rest. Set a persistent <code>SENTINEL_VAULT_KEY</code> before creating virtual keys, then use <code>POST /api/virtual-keys</code> to register a provider credential.</p>
        </section>
      </div>
    </div>
  );
}

function Globe({ size, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
