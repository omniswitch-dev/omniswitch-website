import React, { useEffect, useState } from 'react';
import { 
  Shield, Zap, Activity, Lock, Globe, CheckCircle2, 
  GitBranch, ArrowRight, Terminal, Layers, Server, 
  Database, Cpu, BookOpen, ExternalLink, 
  Star, Copy, Menu, X, Key, Search, Users, Cloud, Box, Scale, RefreshCw
} from 'lucide-react';
import Docs from './Docs';
import ApiReference from './ApiReference';
import Comparison from './Comparison';
import Quickstart from './Quickstart';
import Install from './Install';
import Benchmarks from './Benchmarks';
import Security from './Security';
import Community from './Community';
import Roadmap from './Roadmap';
import Changelog from './Changelog';
import statusData from './data/status.json';
import benchmarksData from './data/benchmarks.json';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle browser back/forward buttons and initial load
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.replace('/', '');
      setCurrentPage(path || 'home');
    };
    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange(); // Set initial page based on URL
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.classList.toggle('menu-open', mobileMenuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [mobileMenuOpen]);

  useEffect(() => {
    // Skip parallax effects on touch devices to prevent overflow
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    // Glow blob & Parallax with rAF throttling for performance
    const blob = document.getElementById('glow-blob');
    let ticking = false;

    const handleMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (blob) {
            blob.animate({
              left: `${e.clientX}px`,
              top: `${e.clientY}px`
            }, { duration: 3000, fill: "forwards" });
          }
          if (!isTouch) {
            const img = document.querySelector('.hero-dashboard-img');
            if (img) {
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;
              const rotateY = (e.clientX - centerX) / 40;
              const rotateX = (centerY - e.clientY) / 40;
              img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Scroll reveals
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Scroll to top on page change
    window.scrollTo(0, 0);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, [currentPage]);

  const navigate = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.history.pushState(null, '', `/${page === 'home' ? '' : page}`);
  };

  const NavLink = ({ page, label }) => (
    <a 
      href={`/${page === 'home' ? '' : page}`} 
      onClick={(e) => { e.preventDefault(); navigate(page); }}
      className={currentPage === page ? 'nav-link active-link' : 'nav-link'}
    >
      {label}
    </a>
  );

  return (
    <div className="app-container">
      <div className="bg-grid"></div>
      <div id="glow-blob"></div>
      
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <span className="pill pill-beta" style={{ marginRight: '0.5rem' }}>Public beta</span>
        <span>OmniSwitch v0.2.0-beta is open. Chat, routing and guardrails are stable; MCP and A2A are still changing. — </span>
        <a href="/#status" onClick={(e) => { e.preventDefault(); navigate('home'); setTimeout(() => document.getElementById('status')?.scrollIntoView({ behavior: 'smooth' }), 50); }}>
          See what's stable <ArrowRight size={14} />
        </a>
      </div>

      {/* Header */}
      <header>
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="logo">
          <Shield className="logo-icon" size={28} />
          OmniSwitch
        </a>
        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink page="home" label="Product" />
          <NavLink page="quickstart" label="Quickstart" />
          <NavLink page="docs" label="Docs" />
          <NavLink page="benchmarks" label="Benchmarks" />
          <NavLink page="comparison" label="Compare" />
          <NavLink page="changelog" label="Changelog" />
          <a href="https://github.com/omniswitch-dev/omniswitch" target="_blank" rel="noreferrer" className="nav-link">GitHub <ExternalLink size={12} /></a>
          <a href="https://github.com/omniswitch-dev/omniswitch" target="_blank" rel="noreferrer" className="btn-primary mobile-only-btn">
            <GitBranch size={18} /> Get Started
          </a>
        </nav>
        <div className="nav-actions">
          <a href="https://github.com/omniswitch-dev/omniswitch" target="_blank" rel="noreferrer" className="btn-primary">
            <GitBranch size={18} /> Get Started
          </a>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Page Content */}
      {currentPage === 'home' && <Home navigate={navigate} />}
      {currentPage === 'docs' && <Docs />}
      {currentPage === 'api' && <ApiReference />}
      {currentPage === 'comparison' && <Comparison navigate={navigate} />}
      {currentPage === 'quickstart' && <Quickstart navigate={navigate} />}
      {currentPage === 'install' && <Install />}
      {currentPage === 'benchmarks' && <Benchmarks />}
      {currentPage === 'security' && <Security />}
      {currentPage === 'community' && <Community navigate={navigate} />}
      {currentPage === 'roadmap' && <Roadmap />}
      {currentPage === 'changelog' && <Changelog />}
      {currentPage === 'about' && <About navigate={navigate} />}

      {/* Footer */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="footer-logo-text">
              <Shield size={22} color="#8e2de2" />
              OmniSwitch
            </span>
            <p className="footer-tagline">The open-source AI gateway for production teams. Route, guard, cache, and observe all your LLM traffic.</p>
            <p className="footer-copy">© 2026 OmniSwitch. Apache 2.0 License.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('home'); }}>Features</a>
            <a href="/quickstart" onClick={(e) => { e.preventDefault(); navigate('quickstart'); }}>Quickstart</a>
            <a href="/benchmarks" onClick={(e) => { e.preventDefault(); navigate('benchmarks'); }}>Benchmarks</a>
            <a href="/comparison" onClick={(e) => { e.preventDefault(); navigate('comparison'); }}>Comparison</a>
            <a href="/api" onClick={(e) => { e.preventDefault(); navigate('api'); }}>API Reference</a>
            <a href="/changelog" onClick={(e) => { e.preventDefault(); navigate('changelog'); }}>Changelog</a>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="/docs" onClick={(e) => { e.preventDefault(); navigate('docs'); }}>Documentation</a>
            <a href="/install" onClick={(e) => { e.preventDefault(); navigate('install'); }}>Install guide</a>
            <a href="/security" onClick={(e) => { e.preventDefault(); navigate('security'); }}>Security policy</a>
            <a href="/roadmap" onClick={(e) => { e.preventDefault(); navigate('roadmap'); }}>Roadmap</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); navigate('about'); }}>About</a>
          </div>
          <div className="footer-col">
            <h4>Community</h4>
            <a href="https://github.com/omniswitch-dev/omniswitch" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://github.com/omniswitch-dev/omniswitch/issues" target="_blank" rel="noreferrer">Report a Bug</a>
            <a href="https://github.com/omniswitch-dev/omniswitch/discussions" target="_blank" rel="noreferrer">Discussions</a>
            <a href="/community" onClick={(e) => { e.preventDefault(); navigate('community'); }}>Beta feedback</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===== HOME PAGE ===== */
function Home({ navigate }) {
  const [copied, setCopied] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState('Python');
  const installCmd = 'curl -fsSL https://raw.githubusercontent.com/omniswitch-dev/omniswitch/main/install.sh | sh';
  const benchmarksPending = benchmarksData.state === 'pending';

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goto = (page) => (e) => { e.preventDefault(); navigate(page); };

  const nativeProviders = ['OpenAI', 'Anthropic', 'Google Gemini', 'Groq', 'Cohere', 'Azure OpenAI', 'AWS Bedrock'];
  const presetProviders = ['Mistral', 'DeepSeek', 'xAI', 'Together', 'Fireworks', 'OpenRouter', 'Ollama', 'vLLM'];

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Star size={14} /> Open Source &middot; Apache-2.0 &middot; Single Go Binary
          </div>
          <h1 className="hero-title">
            One base URL for <span>every model</span>. Fallbacks, guardrails and tracing included.
          </h1>
          <p className="hero-description">
            OmniSwitch is a self-hosted, OpenAI-compatible AI gateway. Keep the SDK you already use — change one line —
            and get provider fallbacks, per-app keys and budgets, local guardrails, and a request trace for every call.
            It's an early public beta: see the <a href="#status" onClick={(e) => { e.preventDefault(); document.getElementById('status')?.scrollIntoView({ behavior: 'smooth' }); }}>status board</a> below for what's stable.
          </p>
          <div className="install-bar" onClick={handleCopy}>
            <Terminal size={16} />
            <code>{installCmd}</code>
            <button className="copy-btn">{copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}</button>
          </div>
          <p className="alt-install">
            Also: <a href="/install" onClick={goto('install')}>brew install omniswitch-dev/tap/omniswitch</a> ·{' '}
            <a href="/install" onClick={goto('install')}>docker run ghcr.io/omniswitch-dev/omniswitch</a> ·{' '}
            <a href="/install" onClick={goto('install')}>Helm chart</a>
          </p>
          <div className="hero-actions">
            <a href="#quickstart" onClick={(e) => { e.preventDefault(); navigate('quickstart'); }} className="btn-primary btn-lg">
              <GitBranch size={20} /> Run it in 2 minutes
            </a>
            <a href="/benchmarks" onClick={goto('benchmarks')} className="btn-secondary btn-lg">
              <Activity size={20} /> Read the benchmarks
            </a>
          </div>
          <div className="hero-facts">
            <div className="hero-fact">
              <span className="v">1 binary</span>
              <span className="l">SQLite built in · Redis optional</span>
            </div>
            <div className="hero-fact">
              <span className="v">7 + any</span>
              <span className="l">native adapters + OpenAI-compatible</span>
            </div>
            <div className="hero-fact">
              <span className="v">Apache-2.0</span>
              <span className="l">no enterprise fork</span>
            </div>
            <div className="hero-fact">
              <span className="v">{benchmarksPending ? 'pending' : 'v0.2.0-beta'}</span>
              <span className="l">{benchmarksPending ? (
                <a href="/benchmarks" onClick={goto('benchmarks')}>first cross-gateway run · see methodology</a>
              ) : 'current release'}</span>
            </div>
          </div>
        </div>
        <div className="term-card">
          <div className="code-tabs">
            {['Python', 'Node.js', 'cURL'].map(tab => (
              <span
                key={tab}
                className={`code-tab ${activeCodeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveCodeTab(tab)}
              >
                {tab}
              </span>
            ))}
          </div>
          <div className="code-block">
            <pre><code>{activeCodeTab === 'Python' ? `from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8080/v1",   # ← the only change
    api_key="sk-omniswitch-…",
)

r = client.chat.completions.create(
    model="smart-model",                   # a route, not a vendor model
    messages=[{"role": "user", "content": "Summarize this ticket…"}],
)
print(r.choices[0].message.content)` : activeCodeTab === 'Node.js' ? `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'http://localhost:8080/v1',   // ← the only change
  apiKey: 'sk-omniswitch-…',
});

const r = await client.chat.completions.create({
  model: 'smart-model',                  // a route, not a vendor model
  messages: [{ role: 'user', content: 'Summarize this ticket…' }],
});
console.log(r.choices[0].message.content);` : `curl http://localhost:8080/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-omniswitch-…" \\
  -d '{
    "model": "smart-model",
    "messages": [{"role": "user", "content": "Summarize this ticket…"}]
  }'`}</code></pre>
          </div>
          <div className="term-log">
            <div><span className="t">12:04:11.021</span> <span className="tag tag-ok">route</span> smart-model → @openai-prod/gpt-4o-mini <span className="t">guardrails: pii=redact ✓</span></div>
            <div><span className="t">12:04:11.842</span> <span className="tag tag-warn">retry</span> 429 from openai-prod · backoff 200ms · attempt 2/3</div>
            <div><span className="t">12:04:12.050</span> <span className="tag tag-warn">fallback</span> → @anthropic-prod/claude-sonnet</div>
            <div><span className="t">12:04:12.913</span> <span className="tag tag-ok">200</span> 863 ms · 412 tok · trace <span className="s">/traces/9f2c…</span></div>
          </div>
        </div>
      </section>

      {/* Providers strip */}
      <section className="providers-section">
        <div className="providers-strip">
          <span className="providers-label">Providers</span>
          {nativeProviders.map(p => <span key={p} className="chip chip-native">{p}</span>)}
          {presetProviders.map(p => <span key={p} className="chip">{p}</span>)}
          <span className="chip chip-more">+ any OpenAI-compatible URL</span>
        </div>
        <p className="providers-legend">Highlighted chips are native adapters · plain chips are one-env-var presets over the OpenAI-compatible custom provider.</p>
      </section>

      {/* Quickstart */}
      <section id="quickstart" className="quickstart">
        <div className="section-header reveal">
          <div className="section-badge">Quickstart</div>
          <h2 className="section-title">From zero to a governed request in three steps</h2>
          <p className="section-subtitle">No account, no cloud control plane, no SDK swap. Everything below runs on your laptop; the same binary runs in Docker or Kubernetes.</p>
        </div>
        <div className="qs-steps reveal delay-2">
          <div className="qs-step">
            <div className="num">1</div>
            <h3>Install and start</h3>
            <p>One binary. SQLite is embedded, so there is nothing else to run.</p>
            <pre>{`curl -fsSL https://…/install.sh | sh
OPENAI_API_KEY=sk-… omniswitch serve
# → gateway on :8080, dashboard at /
# → bootstrap key printed once: sk-omniswitch-…`}</pre>
            <span className="hint">Prefer containers? <a href="/install" onClick={goto('install')}>docker compose up -d</a></span>
          </div>
          <div className="qs-step">
            <div className="num">2</div>
            <h3>Point your SDK at it</h3>
            <p>Any OpenAI client works. Use the bootstrap key or mint per-app keys with budgets.</p>
            <pre>{`client = OpenAI(
  base_url="http://localhost:8080/v1",
  api_key="sk-omniswitch-…")
client.chat.completions.create(
  model="gpt-4o-mini", messages=[…])`}</pre>
            <span className="hint">Also speaks /v1/messages (Anthropic) and /v1/responses (subset).</span>
          </div>
          <div className="qs-step">
            <div className="num">3</div>
            <h3>Add a route with a fallback</h3>
            <p>Edit YAML; it hot-reloads. A bad file is rejected and the last-good config stays live.</p>
            <pre>{`routes:
  smart-model:
    fallbacks: ["@anthropic-prod"]
    max_retries: 2
    retry_codes: [429, 502, 503]
    variants:
      - model: "@openai-prod/gpt-4o-mini"`}</pre>
            <span className="hint">Full walkthrough in the <a href="/quickstart" onClick={goto('quickstart')}>Quickstart guide</a>.</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
        <div className="section-header reveal">
          <div className="section-badge">Core Modules</div>
          <h2 className="section-title">Everything You Need to Ship AI to Production</h2>
          <p className="section-subtitle">A single binary covering inference routing, guardrails, budgets, and agent protocols. Some modules are still beta — see the status board below.</p>
        </div>
        <div className="features-grid">
          {[
            { icon: <Globe />, title: "AI Gateway", desc: "Unified OpenAI-compatible API across OpenAI, Anthropic, Google, Groq, Cohere, and any custom endpoint. Automatic provider routing by model name.", color: "#3b82f6" },
            { icon: <Shield />, title: "Guardrails & Moderations", desc: "Real-time input/output scanning for prompt injection, PII, toxic content, and secret leakage. Rules are precompiled and scanned in a single pass by an embedded Rust-WASM engine with a pure-Go fallback. Plus a local /v1/moderations endpoint.", color: "#ef4444" },
            { icon: <Lock />, title: "Virtual Key Vault", desc: "AES-256-GCM encrypted credential store. Create virtual API keys with rate limits, token budgets, and zero-downtime rotation.", color: "#f59e0b" },
            { icon: <Zap />, title: "Semantic Cache", desc: "Exact and similarity-based semantic cache in SQLite, on top of exact-match caching. Reduces latency and cost for repeated or similar agent queries; scope and threshold semantics are still being tuned in beta.", color: "#10b981" },
            { icon: <Key />, title: "JWT/OIDC Authentication", desc: "Validate signed JWTs against any OIDC provider with JWKS auto-rotation. Map custom claims to roles, workspaces, and organizations.", color: "#06b6d4" },
            { icon: <Scale />, title: "CEL Authorization", desc: "Fine-grained allow/deny rules using Common Expression Language. Control access by method, path, model, role, workspace, or custom JWT claims.", color: "#8b5cf6" },
            { icon: <Search />, title: "Rerank Endpoint", desc: "Provider-neutral /v1/rerank API for RAG retrieval stacks with native Cohere support. Reuses auth, budgets, guardrails, and full logging.", color: "#f97316" },
            { icon: <Users />, title: "A2A Protocol", desc: "Agent-to-Agent v1 support with Agent Card discovery and SendMessage JSON-RPC. Route inter-agent communication through the full gateway pipeline.", color: "#ec4899" },
            { icon: <Layers />, title: "MCP Gateway", desc: "Federate multiple MCP servers over HTTP and stdio. Policy-gated tool execution with namespaced tool discovery and audit logging.", color: "#14b8a6" },
            { icon: <Activity />, title: "Observability", desc: "Built-in dashboard with real-time metrics, request logs, per-request trace waterfalls, cost tracking, OpenTelemetry export to Langfuse or Jaeger, and per-provider analytics.", color: "#a855f7" },
            { icon: <Cloud />, title: "Redis HA Rate Limiting", desc: "Distributed rate limiting with atomic Lua scripts for multi-instance deployments. Fail-closed by default with startup health checks.", color: "#ef4444" },
            { icon: <Box />, title: "Kubernetes Ready", desc: "Production Kubernetes manifests with Deployment, Service, ConfigMap, Redis StatefulSet, and Kustomization. Deploy a full HA stack in minutes.", color: "#6366f1" },
            { icon: <RefreshCw />, title: "Config Hot-Reload", desc: "Edit routes, guardrails, cache posture, circuit breaker, and shadow routing while serving - no restart. Invalid config files keep the last-known-good state.", color: "#0ea5e9" },
          ].map((f, i) => (
            <div key={i} className={`reveal delay-${(i % 3) + 1}`}>
              <div className="feature-card">
                <div className="feature-icon" style={{ color: f.color, background: `${f.color}15` }}>{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="architecture">
        <div className="section-header reveal">
          <div className="section-badge">Architecture</div>
          <h2 className="section-title">How OmniSwitch Fits In Your Stack</h2>
        </div>
        <div className="arch-diagram reveal delay-2">
          <div className="arch-layer">
            <div className="arch-box app-box">
              <Cpu size={20} />
              <span>Your App / Agent</span>
            </div>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer">
            <div className="arch-box gateway-box">
              <Shield size={20} />
              <span>OmniSwitch Gateway</span>
              <div className="arch-modules">
                <span>Guardrails</span>
                <span>Cache</span>
                <span>Vault</span>
                <span>JWT/OIDC</span>
                <span>A2A</span>
                <span>Rerank</span>
                <span>MCP</span>
                <span>Logs</span>
              </div>
            </div>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer arch-providers">
            <div className="arch-box provider-box"><span>OpenAI</span></div>
            <div className="arch-box provider-box"><span>Anthropic</span></div>
            <div className="arch-box provider-box"><span>Google</span></div>
            <div className="arch-box provider-box"><span>Groq</span></div>
            <div className="arch-box provider-box"><span>Cohere</span></div>
            <div className="arch-box provider-box"><span>Ollama</span></div>
          </div>
        </div>
      </section>

      {/* Status board */}
      <section id="status" className="status-section">
        <div className="section-header reveal">
          <div className="section-badge">Beta status</div>
          <h2 className="section-title">What is stable, what is beta, what is not here yet</h2>
          <p className="section-subtitle">We would rather you know before you build on it. Updated every release; tracked in the changelog.</p>
        </div>
        <div className="status-board reveal delay-2">
          {statusData.columns.map(col => (
            <div key={col.key} className={`status-col ${col.key}`}>
              <header>
                <h3>{col.title}</h3>
                <span className={`pill pill-${col.key === 'soon' ? 'soon' : col.key}`}>{col.pill}</span>
              </header>
              <ul>
                {col.items.map((item, i) => (
                  <li key={i}>
                    <span>{item.text}{item.detail && <small>{item.detail}</small>}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="status-note">
          Something here wrong or missing? <a href="https://github.com/omniswitch-dev/omniswitch/issues/new" target="_blank" rel="noreferrer">Open a "beta-status" issue</a>.
          Sourced from {statusData.source}, updated {statusData.updated}.
        </p>
      </section>

      {/* Benchmarks teaser */}
      <section className="bench-teaser-section">
        <div className="bench-teaser reveal">
          <div className="bench-teaser-panel">
            <div className="section-badge" style={{ marginBottom: 0 }}>Benchmarks</div>
            <h2 className="section-title">Numbers we publish — and how we got them</h2>
            <p>A gateway adds latency; the question is how much and how it behaves under failure. We plan to run OmniSwitch
            and other self-hosted gateways on the same pinned hardware against a mock backend, publish the raw runs, and
            say plainly what the numbers do not mean.</p>
            <ul className="docs-list">
              <li>Same machine, same mock backend, same load generator, five repetitions</li>
              <li>Versions and commit SHAs pinned; configs published as-run</li>
              <li>Raw JSON, manifests and Dockerfiles downloadable per run</li>
              <li>Corrections from other maintainers get a re-run and a changelog entry</li>
            </ul>
            <div className="hero-actions" style={{ margin: 0 }}>
              <a href="/benchmarks" onClick={(e) => { e.preventDefault(); navigate('benchmarks'); }} className="btn-primary">Read the benchmark page</a>
              <a href="https://github.com/omniswitch-dev/omniswitch/blob/main/BENCHMARKS.md" target="_blank" rel="noreferrer" className="btn-secondary">Reproduce it yourself</a>
            </div>
          </div>
          <div className="bench-teaser-panel">
            {benchmarksPending ? (
              <>
                <div className="pill pill-beta" style={{ marginBottom: '0.8rem' }}>Cross-gateway run: pending</div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
                  No cross-gateway comparison has run yet. The one number we can show today is the guardrail-scanning
                  micro-benchmark from BENCHMARKS.md, measured on a laptop-class machine — not the pinned rig this page
                  will use once the harness lands.
                </p>
                <div className="kpi-grid">
                  {benchmarksData.kpis.map((k, i) => (
                    <div key={i} className="kpi-tile ghost">
                      <div className="l">{k.label}</div>
                      <div className="v">&mdash;</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>Published results — see the benchmarks page.</p>
            )}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="community-section">
        <div className="section-header reveal">
          <div className="section-badge">Community</div>
          <h2 className="section-title">Help us finish the beta</h2>
          <p className="section-subtitle">Here is what we need most and where the conversation happens.</p>
        </div>
        <div className="community-grid reveal delay-2">
          <div className="community-card">
            <h3>Try it on real traffic</h3>
            <p>Put OmniSwitch in front of one app, one route, one fallback. Tell us what broke, what confused you, and what you had to read the source to figure out.</p>
            <a className="link" href="https://github.com/omniswitch-dev/omniswitch/issues/new?template=beta-feedback.yml" target="_blank" rel="noreferrer">Beta feedback template →</a>
          </div>
          <div className="community-card">
            <h3>Good first issues</h3>
            <p>Provider presets, docs gaps, dashboard rough edges and test coverage are labelled and scoped for a first PR.</p>
            <a className="link" href="https://github.com/omniswitch-dev/omniswitch/issues?q=is%3Aopen+is%3Aissue+label%3Agood-first-issue" target="_blank" rel="noreferrer">Issues labelled good-first-issue →</a>
          </div>
          <div className="community-card">
            <h3>Discussions and roadmap</h3>
            <p>Design proposals, changelog, and beta exit criteria live in GitHub Discussions. Security reports go through SECURITY.md, not issues.</p>
            <a className="link" href="/community" onClick={(e) => { e.preventDefault(); navigate('community'); }}>Join the discussion →</a>
          </div>
        </div>
      </section>

      {/* Why OmniSwitch */}
      <section id="comparison" className="comparison">
        <div className="section-header reveal">
          <div className="section-badge">Why OmniSwitch</div>
          <h2 className="section-title">Open-Source. Self-Hosted. No Vendor Lock-In.</h2>
          <p className="section-subtitle">A detailed, footnoted feature comparison against other AI gateways lives on its own page — several rows are partial, not full support, and we say so.</p>
        </div>
        <div className="hero-actions reveal delay-2" style={{ justifyContent: 'center' }}>
          <a href="/comparison" onClick={(e) => { e.preventDefault(); navigate('comparison'); }} className="btn-primary btn-lg">
            See the full comparison <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-content reveal">
          <h2 className="cta-title">Put a Gateway in Front of Your App This Afternoon</h2>
          <p className="cta-desc">
            One binary. No vendor lock-in. Full control over your AI infrastructure — still in public beta.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <a href="/quickstart" onClick={(e) => { e.preventDefault(); navigate('quickstart'); }} className="btn-primary btn-lg">
              Get Started <ArrowRight size={20} />
            </a>
            <a href="/docs" onClick={(e) => { e.preventDefault(); navigate('docs'); }} className="btn-secondary btn-lg">
              <BookOpen size={20} /> Read the Docs
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

/* ===== ABOUT PAGE ===== */
function About({ navigate }) {
  return (
    <div className="about-container">
      <div className="section-header reveal">
        <div className="section-badge">About</div>
        <h2 className="section-title">The Story Behind OmniSwitch</h2>
      </div>
      
      <div className="about-content reveal delay-1">
        <div className="about-text">
          <h3>Why We Built OmniSwitch</h3>
          <p>
            We were building AI-powered applications and hit the same wall every team hits: managing multiple LLM providers, 
            securing API keys, preventing prompt injection, tracking costs, and debugging agent workflows — all while trying to 
            ship features.
          </p>
          <p>
            Existing solutions either required expensive SaaS subscriptions, heavy infrastructure (Redis, Postgres, Kafka), 
            or were too narrow in scope. We wanted something different: a single binary you can run locally or in production 
            that handles <strong>most of it</strong> — routing, security, caching, and observability — with no required external services.
          </p>
          <p>
            That's OmniSwitch. Written in Go, powered by SQLite, licensed under Apache 2.0, and built for production teams —
            currently in public beta. Some modules are stable, others are still changing; see the{' '}
            <a href="/#status" onClick={(e) => { e.preventDefault(); navigate('home'); setTimeout(() => document.getElementById('status')?.scrollIntoView({ behavior: 'smooth' }), 50); }}>status board</a> on the homepage.
          </p>
          
          <h3>Our Principles</h3>
          <ul className="about-principles">
            <li><strong>Local-First:</strong> Your data never leaves your network. No SaaS telemetry. No cloud lock-in.</li>
            <li><strong>No Required External Services:</strong> One binary, one SQLite file by default. Redis is optional (multi-replica rate limits); a Postgres driver is planned but not shipped yet.</li>
            <li><strong>OpenAI-Compatible:</strong> Change one line of code to route chat completions, embeddings, and more through OmniSwitch.</li>
            <li><strong>Security by Default:</strong> Guardrails are on by default. API keys are encrypted at rest. Every request is logged.</li>
            <li><strong>Open Source Forever:</strong> Apache 2.0. No "open core" bait-and-switch. The full product is free.</li>
          </ul>

          <h3>Tech Stack</h3>
          <div className="tech-stack-grid">
            <div className="tech-item"><Server size={20} /> <span><strong>Go</strong> — Core runtime</span></div>
            <div className="tech-item"><Database size={20} /> <span><strong>SQLite</strong> — Storage, cache, logs</span></div>
            <div className="tech-item"><Lock size={20} /> <span><strong>AES-256-GCM</strong> — Key encryption</span></div>
            <div className="tech-item"><Shield size={20} /> <span><strong>CEL</strong> — Policy evaluation</span></div>
          </div>

          <h3>Contributing</h3>
          <p>
            OmniSwitch is built in the open and we welcome contributions. Whether it's a bug fix, a new provider adapter, 
            or an entirely new guardrail engine — we'd love your help.
          </p>
          <div className="about-cta">
            <a href="https://github.com/omniswitch-dev/omniswitch" target="_blank" rel="noreferrer" className="btn-primary">
              <GitBranch size={18} /> Contribute on GitHub
            </a>
            <a href="https://github.com/omniswitch-dev/omniswitch/issues" target="_blank" rel="noreferrer" className="btn-secondary">
              Report an Issue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
