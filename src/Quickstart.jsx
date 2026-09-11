import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { BetaBadge, KnownLimitations } from './BetaNotice';

const CURL_TEST = `curl http://localhost:8080/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-omniswitch-..." \\
  -d '{"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "Say hi"}]}'`;

const paths = [
  {
    key: 'binary',
    title: '1 · Binary',
    lines: [
      'curl -fsSL https://raw.githubusercontent.com/omniswitch-dev/omniswitch/main/install.sh | sh',
      'OPENAI_API_KEY=sk-... omniswitch serve',
    ],
  },
  {
    key: 'docker',
    title: '2 · Docker',
    lines: [
      'docker run -p 8080:8080 -e OPENAI_API_KEY=sk-... ghcr.io/omniswitch-dev/omniswitch:0.2.0-beta.1',
    ],
  },
  {
    key: 'brew',
    title: '3 · Homebrew',
    lines: [
      'brew install omniswitch-dev/tap/omniswitch',
      'OPENAI_API_KEY=sk-... omniswitch serve',
    ],
  },
];

export default function Quickstart({ navigate }) {
  const [tab, setTab] = useState('Python');

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="section-badge"><BetaBadge /> Quickstart</div>
        <h1>From zero to a governed request in three steps</h1>
        <p>No account, no cloud control plane, no SDK swap. Pick any install path below — all three end at the same request.</p>
      </div>

      <KnownLimitations />

      <div className="page-section">
        <h2>Step 1 — Install and start</h2>
        <div className="qs-steps">
          {paths.map((p) => (
            <div className="qs-step" key={p.key}>
              <div className="num">{p.key === 'binary' ? 1 : p.key === 'docker' ? 2 : 3}</div>
              <h3>{p.title.replace(/^\d+ · /, '')}</h3>
              <pre><code>{p.lines.join('\n')}</code></pre>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '1.5rem' }}>
          All three start the gateway on <code>:8080</code> with the dashboard at <code>/</code> and print a bootstrap key once
          (<code>sk-omniswitch-...</code>). Check it is alive:
        </p>
        <div className="code-block" style={{ maxWidth: 700, margin: '1rem auto 0' }}>
          <div className="code-header">Health check</div>
          <pre><code>{'curl http://localhost:8080/healthz'}</code></pre>
        </div>
        <div className="code-block" style={{ maxWidth: 700, margin: '1rem auto 0' }}>
          <div className="code-header">Verify it routes a real request</div>
          <pre><code>{CURL_TEST}</code></pre>
        </div>
      </div>

      <div className="page-section">
        <h2>Step 2 — Point your SDK at it</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Any OpenAI client works unchanged — set <code>base_url</code>/<code>baseURL</code> to your gateway and use the bootstrap
          key or a virtual key you mint with a budget.
        </p>
        <div className="code-showcase" style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="code-tabs">
            {['Python', 'Node.js', 'cURL'].map((t) => (
              <span key={t} className={`code-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</span>
            ))}
          </div>
          <div className="code-block">
            <pre><code>{tab === 'Python'
              ? `from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="sk-omniswitch-...",
)

r = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello, OmniSwitch!"}],
)
print(r.choices[0].message.content)`
              : tab === 'Node.js'
              ? `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'http://localhost:8080/v1',
  apiKey: 'sk-omniswitch-...',
});

const r = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello, OmniSwitch!' }],
});
console.log(r.choices[0].message.content);`
              : CURL_TEST}</code></pre>
          </div>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '0.8rem' }}>
          Also speaks <code>/v1/responses</code> and <code>/v1/messages</code> (Anthropic) — both are documented subsets, see the
          API reference.
        </p>
      </div>

      <div className="page-section">
        <h2>Step 3 — Add a fallback route</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Edit the YAML config; it hot-reloads. An invalid file is rejected and the last-good config stays live.
        </p>
        <div className="code-block" style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="code-header">gateway-config.yaml</div>
          <pre><code>{`routes:
  smart-model:
    fallbacks: ["@anthropic-prod"]
    max_retries: 2
    retry_codes: [429, 502, 503]
    variants:
      - model: "@openai-prod/gpt-4o-mini"`}</code></pre>
        </div>
        <div className="code-block" style={{ maxWidth: 700, margin: '1rem auto 0' }}>
          <div className="code-header">Validate before you reload</div>
          <pre><code>{'omniswitch validate-config gateway-config.yaml'}</code></pre>
        </div>
      </div>

      <div className="page-section" style={{ textAlign: 'center' }}>
        <a className="btn-primary" href="/install" onClick={(e) => { e.preventDefault(); navigate('install'); }}>
          All install methods, verify and upgrade <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}
