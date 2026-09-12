import React from 'react';
import { BookOpen, Terminal, Settings, Shield, Key, RefreshCw } from 'lucide-react';
import { BetaBadge, KnownLimitations } from './BetaNotice';
import './index.css';

export default function Docs() {
  return (
    <div className="docs-container">
      <div className="docs-sidebar">
        <h3>Documentation</h3>
        <BetaBadge text="Public beta" />
        <ul>
          <li><a href="#quickstart" className="active">Quickstart</a></li>
          <li><a href="#configuration">Configuration</a></li>
          <li><a href="#hot-reload">Hot Reload</a></li>
          <li><a href="#providers">Providers</a></li>
          <li><a href="#guardrails">Guardrails</a></li>
          <li><a href="#vault">Virtual Key Vault</a></li>
        </ul>
      </div>

      <div className="docs-content">
        <h1 className="docs-title">OmniSwitch Documentation</h1>
        <p className="docs-intro">Learn how to deploy, configure, and scale OmniSwitch AI Gateway.</p>
        <KnownLimitations />

        <section id="quickstart" className="docs-section">
          <h2><Terminal size={24} className="section-icon" /> Quickstart</h2>
          <p>Get up and running in minutes. Install a prebuilt release, run from source, or use Docker.</p>

          <div className="code-block">
            <div className="code-header">Install (macOS / Linux)</div>
            <pre><code>{`# Install the latest release
curl -fsSL https://raw.githubusercontent.com/omniswitch-dev/omniswitch/main/install.sh | sh

# Start the gateway
OPENAI_API_KEY=sk-your-key omniswitch serve`}</code></pre>
          </div>

          <div className="code-block">
            <div className="code-header">Run from source</div>
            <pre><code>{`git clone https://github.com/omniswitch-dev/omniswitch
cd omniswitch

OPENAI_API_KEY=sk-your-key go run ./cmd/gateway`}</code></pre>
          </div>

          <div className="code-block">
            <div className="code-header">Docker</div>
            <pre><code>{`docker compose up -d`}</code></pre>
          </div>

          <p>Once running, your dashboard is available at <code>http://localhost:8080</code> and your AI gateway is ready to receive OpenAI-compatible requests at <code>http://localhost:8080/v1/chat/completions</code>.</p>
        </section>

        <section id="configuration" className="docs-section">
          <h2><Settings size={24} className="section-icon" /> Configuration</h2>
          <p>OmniSwitch is configured by a declarative YAML file you can check into version control (GitOps).</p>

          <div className="code-block">
            <div className="code-header">gateway-config.yaml</div>
            <pre><code>{`apiVersion: omniswitch.dev/v1
kind: GatewayConfig

gateway:
  listen: ":8080"
  auth: true
  cache_scope: api_key
  log_payloads: false

routes:
  smart-model:
    provider: "@openai"
    fallbacks: ["@anthropic"]
    max_retries: 2
    timeout: 30s
    variants:
      - provider: "@openai"
        model: "@openai/gpt-4o-mini"
        weight: 100

guardrails:
  actions:
    injection: deny
    pii: redact
  rules:
    - name: no-secret-marker
      stage: both
      pattern: '(?i)internal-secret'
      action: deny

providers:
  - name: openai-prod
    type: openai
    api_key_env: OPENAI_API_KEY
  - name: ollama-local
    type: custom
    base_url: http://localhost:11434/v1`}</code></pre>
          </div>

          <p>Run the gateway with your config: <code>OMNISWITCH_CONFIG=gateway-config.yaml go run ./cmd/gateway</code></p>
        </section>

        <section id="hot-reload" className="docs-section">
          <h2><RefreshCw size={24} className="section-icon" /> Config Hot-Reload</h2>
          <p>OmniSwitch watches your config file and applies changes while serving traffic - no restart required:</p>
          <ul className="docs-list">
            <li><strong>Applied live:</strong> routes, guardrails, cache threshold/TTL/scope, payload logging, stream buffering, max request size, circuit breaker settings, and shadow routing.</li>
            <li><strong>Safe by default:</strong> an invalid file is rejected with a log line and the previous configuration stays active.</li>
            <li><strong>Requires restart:</strong> identity providers, rate-limit backends, MCP targets, and listener settings.</li>
          </ul>
        </section>

        <section id="providers" className="docs-section">
          <h2><BookOpen size={24} className="section-icon" /> Supported Providers</h2>
          <p>OmniSwitch ships native adapters plus a <code>custom</code> provider for any endpoint that speaks the OpenAI specification.</p>

          <ul className="docs-list">
            <li><strong>OpenAI:</strong> <code>type: openai</code></li>
            <li><strong>Anthropic:</strong> <code>type: anthropic</code></li>
            <li><strong>Google Gemini:</strong> <code>type: google</code></li>
            <li><strong>Groq:</strong> <code>type: groq</code></li>
            <li><strong>Cohere:</strong> <code>type: cohere</code> (Native rerank support with rerank-v3.5, rerank-english-v3.0, rerank-multilingual-v3.0)</li>
            <li><strong>Azure OpenAI:</strong> <code>type: azure</code></li>
            <li><strong>AWS Bedrock:</strong> <code>type: bedrock</code></li>
            <li><strong>Everything Else:</strong> <code>type: custom</code> (DeepSeek, Mistral, xAI, vLLM, Ollama, Together AI, etc.)</li>
          </ul>
        </section>

        <section id="guardrails" className="docs-section">
          <h2><Shield size={24} className="section-icon" /> Guardrails</h2>
          <p>Guardrails execute locally to protect your agents and users. Built-in checks cover prompt injection, SQL injection, toxic content, secret leakage, and PII detection - on input, output, or both.</p>
          <p>Custom regex rules are compiled once at load time and evaluated in a single pass by an embedded Rust-WASM scanner, falling back transparently to Go's regexp engine when needed.</p>
          <ul className="docs-list">
            <li><strong>Prompt Injection (Input):</strong> Blocks attempts to bypass system prompts.</li>
            <li><strong>SQL Injection (Input):</strong> Detects malicious SQL queries in user input.</li>
            <li><strong>Toxic Content (Input/Output):</strong> Filters profanity and harmful language.</li>
            <li><strong>Secret Leakage (Output):</strong> Prevents models from outputting AWS keys or API credentials.</li>
            <li><strong>PII Detection (Input/Output):</strong> Flags credit cards, emails, and SSNs.</li>
            <li><strong>Custom Rules:</strong> Your own regex with <code>deny</code>, <code>redact</code>, <code>warn</code>, or <code>log</code> actions per stage.</li>
            <li><strong>Webhook & LLM Judges:</strong> Delegate decisions to external services or a model-as-judge endpoint.</li>
          </ul>
        </section>

        <section id="vault" className="docs-section">
          <h2><Key size={24} className="section-icon" /> Virtual Key Vault</h2>
          <p>Never hardcode provider API keys in your application. OmniSwitch's Virtual Key Vault encrypts your provider keys using AES-256-GCM.</p>
          <p>You can create virtual keys (e.g. <code>sk-omniswitch-123</code>) and distribute those to your teams or agents. Each virtual key can have strict rate limits and cost budgets.</p>

          <div className="code-block">
            <div className="code-header">Terminal</div>
            <pre><code>{`# Generate a new virtual key with a 60 requests/min limit
curl -X POST http://localhost:8080/api/keys \\
  -H "Content-Type: application/json" \\
  -d '{"name": "production-agent", "rate_limit": 60}'`}</code></pre>
          </div>
        </section>
      </div>
    </div>
  );
}

