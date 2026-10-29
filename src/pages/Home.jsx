import { useState } from 'react'
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  CircleDot,
  Code2,
  GitBranch,
  GitFork,
  KeyRound,
  Layers,
  LockKeyhole,
  Network,
  Radio,
  ShieldCheck,
  Terminal,
} from 'lucide-react'
import { Button, CodePanel, Eyebrow, Pill, TextLink } from '../components/UI.jsx'
import { ClaimCell } from '../components/Matrix.jsx'
import { latestReview, displayDate, capabilityName } from '../data/comparison.js'
import { A2A_SCOPE, repoUrl } from '../data/product.js'
import status from '../data/status.json'
import './Home.css'

const clientCode = `from openai import OpenAI

client = OpenAI(
    base_url=GATEWAY_URL,
    api_key=OMNISWITCH_KEY,
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user",
               "content": "Hello"}],
)`
const teaserRows = ['fallbacks-retries', 'guardrails-builtin', 'mcp-http']
const scenarios = [
  {
    id: 'route',
    label: 'Route',
    Icon: GitBranch,
    event: 'Request routed to your primary provider.',
    detail: 'Your app calls one endpoint. The gateway selects the configured upstream.',
    trace: ['Key verified', 'Guardrails checked', 'Primary selected', 'Trace recorded'],
    code: 'route: primary',
  },
  {
    id: 'fallback',
    label: 'Fail over',
    Icon: Network,
    event: 'Primary unavailable. Fallback selected.',
    detail: 'A configured fallback chain keeps provider selection out of your application.',
    trace: ['Key verified', 'Guardrails checked', 'Fallback selected', 'Trace recorded'],
    code: 'route: fallback',
  },
  {
    id: 'guard',
    label: 'Redact',
    Icon: ShieldCheck,
    event: 'PII redacted before the upstream call.',
    detail: 'Local checks apply your configured redaction rules before forwarding the request.',
    trace: ['Key verified', 'PII redacted', 'Primary selected', 'Trace recorded'],
    code: 'pii: redact',
  },
]

function Switchboard() {
  const [selected, setSelected] = useState('route')
  const scenario = scenarios.find((item) => item.id === selected)
  return (
    <figure
      className={`switchboard scenario-${selected}`}
      aria-label="Interactive gateway illustration"
    >
      <div className="board-heading mono">
        <span>
          <span className="signal-dot" /> YOUR INFRASTRUCTURE
        </span>
        <span>OS / 01</span>
      </div>
      <div className="board-tabs" role="group" aria-label="Explore a sample request">
        {scenarios.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={selected === id}
            onClick={() => setSelected(id)}
          >
            <Icon className="icon" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      <div className="board-network" aria-hidden="true">
        <div className="network-labels mono">
          <span>INBOUND</span>
          <span>THE SWITCH</span>
          <span>UPSTREAMS</span>
        </div>
        <svg className="network-wires" viewBox="0 0 540 235" preserveAspectRatio="none">
          <path
            className="wire-idle"
            d="M94 48H136Q156 48 156 68V100Q156 118 180 118H215M94 118H215M94 188H136Q156 188 156 168V136Q156 118 180 118M325 118H355Q378 118 378 96V70Q378 48 400 48H446M325 118H446M325 118H355Q378 118 378 140V166Q378 188 400 188H446"
          />
          <path className="wire-active inbound-wire" d="M94 118H215" />
          <path
            className="wire-active primary-wire"
            d="M325 118H355Q378 118 378 96V70Q378 48 400 48H446"
          />
          <path className="wire-active fallback-wire" d="M325 118H446" />
        </svg>
        <div className="network-sources">
          <div className="network-node">
            <Code2 className="icon" />
            <span>Apps</span>
          </div>
          <div className="network-node active">
            <Terminal className="icon" />
            <span>SDKs</span>
          </div>
          <div className="network-node">
            <Layers className="icon" />
            <span>Agents</span>
          </div>
        </div>
        <div className="switch-core">
          <div className="core-corners" />
          <img src="/favicon.svg" width="48" height="46" alt="" />
          <span className="mono">OMNISWITCH</span>
          <span className="core-status mono">{scenario.code}</span>
        </div>
        <div className="network-destinations">
          <div className={`destination ${selected === 'fallback' ? 'unavailable' : 'active'}`}>
            <span className="destination-symbol">01</span>
            <span>
              Primary<small>{selected === 'fallback' ? 'Unavailable' : 'Cloud model'}</small>
            </span>
            <span className="destination-light" />
          </div>
          <div className={`destination ${selected === 'fallback' ? 'active' : ''}`}>
            <span className="destination-symbol">02</span>
            <span>
              Fallback<small>Cloud model</small>
            </span>
            <span className="destination-light" />
          </div>
          <div className="destination">
            <span className="destination-symbol">03</span>
            <span>
              Local<small>Your endpoint</small>
            </span>
            <span className="destination-light" />
          </div>
        </div>
      </div>
      <div className="board-trace" aria-label="Sample request steps">
        {scenario.trace.map((step, index) => (
          <div key={index}>
            <Check className="icon" aria-hidden="true" />
            <span>{step}</span>
          </div>
        ))}
      </div>
      <div className="board-result" role="status" aria-live="polite" aria-atomic="true">
        <div>
          <CircleDot className="icon" aria-hidden="true" />
          <strong>{scenario.event}</strong>
        </div>
        <p>{scenario.detail}</p>
      </div>
      <figcaption className="board-caption mono">
        INTERACTIVE ILLUSTRATION / SAMPLE REQUEST
      </figcaption>
    </figure>
  )
}

function SectionLabel({ number, children }) {
  return (
    <div className="section-label mono">
      <span>{number}</span>
      {children}
    </div>
  )
}

export default function Home() {
  return (
    <div className="home">
      <section className="switch-hero" id="top" aria-labelledby="hero-title">
        <div className="container switch-hero-inner">
          <div className="hero-copy">
            <Eyebrow>
              <span className="tiny-cross" aria-hidden="true">
                +
              </span>{' '}
              THE OPEN-SOURCE AI GATEWAY
            </Eyebrow>
            <h1 id="hero-title" tabIndex={-1}>
              Every model.
              <br />
              One switch.
              <br />
              <span>Your rules.</span>
            </h1>
            <p className="hero-description">
              Route models. Guard your data. Govern your agents. One self-hosted gateway puts you in
              control of the AI traffic that matters.
            </p>
            <div className="hero-actions">
              <Button href="/quickstart" variant="primary" arrow data-component-id="hero-run">
                Run OmniSwitch
              </Button>
              <a href={repoUrl} className="hero-github" data-component-id="hero-github">
                <GitFork className="icon" aria-hidden="true" /> Explore the code{' '}
                <ArrowUpRight className="icon" aria-hidden="true" />
              </a>
            </div>
            <div className="hero-note mono">
              <span className="signal-dot" /> SELF-HOSTED <span>/</span> APACHE-2.0 <span>/</span>{' '}
              PUBLIC BETA
            </div>
          </div>
          <Switchboard />
        </div>
        <div className="container hero-baseline mono">
          <span>YOUR STACK. YOUR BOUNDARIES.</span>
          <a href="#control">
            MEET YOUR CONTROL LAYER <ArrowDown className="icon" aria-hidden="true" />
          </a>
        </div>
      </section>
      <section className="foundation-strip" aria-label="Deployment fundamentals">
        <div className="container foundation-grid">
          <div>
            <span className="fact-index mono">01 /</span>
            <p>
              <strong>One Go binary.</strong>
              <span>Binary, Docker, or Kubernetes.</span>
            </p>
          </div>
          <div>
            <span className="fact-index mono">02 /</span>
            <p>
              <strong>Your infrastructure.</strong>
              <span>SQLite built in. Redis optional.</span>
            </p>
          </div>
          <div>
            <span className="fact-index mono">03 /</span>
            <p>
              <strong>Open by design.</strong>
              <span>Apache-2.0. Read every line.</span>
            </p>
          </div>
        </div>
      </section>
      <section className="control-section container" id="control" aria-labelledby="control-title">
        <SectionLabel number="01">THE CONTROL LAYER</SectionLabel>
        <div className="section-intro">
          <h2 id="control-title">
            More possibility.
            <br />
            <span>Less crossed wires.</span>
          </h2>
          <p>
            Providers change. Requests fail. Agents need boundaries. Put the decisions in one place,
            and keep building your product.
          </p>
        </div>
        <div className="capability-grid">
          <article className="capability routing-capability">
            <div className="capability-top">
              <GitBranch className="icon" aria-hidden="true" />
              <span className="mono">ROUTING / RESILIENCE</span>
              <span className="feature-index mono">01</span>
            </div>
            <h3>
              The right route.
              <br />A way around failure.
            </h3>
            <p>
              Set weighted routes, fallback chains, retries, and timeouts. Reload routing config
              without restarting the gateway.
            </p>
            <div
              className="route-illustration"
              aria-label="Illustrative fallback chain: primary provider unavailable, secondary selected."
            >
              <div className="route-origin mono">
                REQUEST <ArrowRight className="icon" aria-hidden="true" />
              </div>
              <div className="route-options">
                <div>
                  <span className="route-node-dot unavailable" />
                  <span>Primary provider</span>
                  <span className="route-state mono">UNAVAILABLE</span>
                </div>
                <div className="chosen">
                  <span className="route-node-dot" />
                  <span>Fallback provider</span>
                  <span className="route-state mono">
                    SELECTED <Check className="icon" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </div>
            <TextLink href="/docs#routing">Explore routing</TextLink>
          </article>
          <article className="capability access-capability">
            <div className="capability-top">
              <KeyRound className="icon" aria-hidden="true" />
              <span className="mono">ACCESS / BUDGETS</span>
              <span className="feature-index mono">02</span>
            </div>
            <h3>
              Give access.
              <br />
              Keep the boundaries.
            </h3>
            <p>
              Hashed API keys, roles, workspace boundaries, per-key budgets, and request limits. Set
              the terms for every caller.
            </p>
            <div className="key-illustration mono">
              <span>
                <LockKeyhole className="icon" aria-hidden="true" /> KEY / PRODUCT-TEAM
              </span>
              <div>
                <span>access</span>
                <strong>scoped</strong>
              </div>
              <div>
                <span>budget</span>
                <strong>
                  enforced <Check className="icon" aria-hidden="true" />
                </strong>
              </div>
            </div>
            <TextLink href="/security">Explore access controls</TextLink>
          </article>
          <article className="capability guard-capability">
            <div className="capability-top">
              <ShieldCheck className="icon" aria-hidden="true" />
              <span className="mono">GUARDRAILS / LOCAL CHECKS</span>
              <span className="feature-index mono">03</span>
            </div>
            <h3>
              Your data.
              <br />
              Your line in the sand.
            </h3>
            <p>
              Check for PII, injection, and secrets locally. Configure deny and redact actions
              before traffic reaches an upstream.
            </p>
            <div className="redact-illustration mono">
              <span>BEFORE THE UPSTREAM CALL</span>
              <div>
                Contact: <mark>[EMAIL_REDACTED]</mark>
              </div>
              <p>
                <ShieldCheck className="icon" aria-hidden="true" /> PII rule applied
              </p>
            </div>
            <TextLink href="/security">Explore guardrails</TextLink>
          </article>
          <article className="capability observe-capability">
            <div className="capability-top">
              <Activity className="icon" aria-hidden="true" />
              <span className="mono">TRACES / VISIBILITY</span>
              <span className="feature-index mono">04</span>
            </div>
            <h3>
              Follow the request.
              <br />
              Understand the result.
            </h3>
            <p>
              Inspect request traces and guardrail events. Send metrics and telemetry to the
              observability stack you already use.
            </p>
            <div
              className="trace-illustration"
              aria-label="Illustrative request trace stages, not measured performance."
            >
              {[
                ['Authenticate', 'auth'],
                ['Guardrails', 'guard'],
                ['Upstream call', 'upstream'],
                ['Record trace', 'record'],
              ].map(([label, name]) => (
                <div key={name}>
                  <span className="mono">{label}</span>
                  <div className={`trace-bar ${name}`} />
                  <Check className="icon" aria-hidden="true" />
                </div>
              ))}
            </div>
            <TextLink href="/docs#observability">Explore observability</TextLink>
          </article>
        </div>
        <p className="illustration-note mono">
          CONTROL EXAMPLES ARE ILLUSTRATIVE. CONFIGURE POLICIES FOR YOUR DEPLOYMENT.
        </p>
      </section>
      <section className="developer-section" id="routing" aria-labelledby="routing-title">
        <div className="container">
          <SectionLabel number="02">KEEP YOUR FLOW</SectionLabel>
          <div className="developer-layout">
            <div className="developer-copy">
              <h2 id="routing-title">
                Switch models.
                <br />
                <span>
                  Keep your
                  <br />
                  application.
                </span>
              </h2>
              <p>
                Use an OpenAI-compatible client with your gateway’s base URL. Keep provider
                selection and routing policies in OmniSwitch.
              </p>
              <ul className="developer-checks">
                {[
                  'Native provider adapters and custom endpoints',
                  'Routing configuration outside your app',
                  'Cloud and local models on your terms',
                ].map((item) => (
                  <li key={item}>
                    <CheckCheck className="icon" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <TextLink href="/quickstart" data-component-id="routing-quickstart">
                Send your first request
              </TextLink>
            </div>
            <div className="developer-code">
              <div className="code-label mono">
                <span>YOUR APP → OMNISWITCH → YOUR PROVIDER</span>
                <Code2 className="icon" aria-hidden="true" />
              </div>
              <CodePanel
                title="Client configuration"
                language="Python"
                code={clientCode}
                footer="GATEWAY_URL is your gateway’s /v1 endpoint."
              />
              <p>
                Responses and Messages APIs are documented subsets.{' '}
                <a href="/api">
                  Review endpoint scope <ArrowUpRight className="icon" aria-hidden="true" />
                </a>
              </p>
            </div>
          </div>
          <div className="adapter-row">
            <span className="mono">NATIVE ADAPTERS</span>
            <div>
              {['OpenAI', 'Anthropic', 'Google Gemini', 'Groq', 'Azure', 'Bedrock', 'Cohere'].map(
                (provider) => (
                  <span key={provider}>{provider}</span>
                ),
              )}
            </div>
            <p>Plus OpenAI-compatible endpoints, including Ollama and vLLM.</p>
          </div>
        </div>
      </section>
      <section className="agent-section container" id="agents" aria-labelledby="agents-title">
        <SectionLabel number="03">BEYOND THE MODEL CALL</SectionLabel>
        <div className="section-intro">
          <h2 id="agents-title">
            Your agents have tools.
            <br />
            <span>Give them boundaries.</span>
          </h2>
          <p>
            Bring tool access and agent messages into the same policy-aware gateway. Explore the
            protocol capabilities available in beta.
          </p>
        </div>
        <div className="protocol-grid">
          <article className="protocol-card">
            <div className="protocol-title">
              <span className="protocol-symbol">
                <Layers className="icon" aria-hidden="true" />
              </span>
              <h3>MCP gateway</h3>
              <Pill />
            </div>
            <p>
              Federate tool discovery and gate calls with policy across HTTP, SSE, and persistent
              stdio targets.
            </p>
            <div className="protocol-flow mono">
              <span>tools/list</span>
              <ArrowRight className="icon" aria-hidden="true" />
              <span className="policy-step">policy</span>
              <ArrowRight className="icon" aria-hidden="true" />
              <span>tools/call</span>
            </div>
            <TextLink href="/api#agents">Explore MCP</TextLink>
          </article>
          <article className="protocol-card">
            <div className="protocol-title">
              <span className="protocol-symbol">
                <Network className="icon" aria-hidden="true" />
              </span>
              <h3>A2A model access</h3>
              <Pill />
            </div>
            <p>{A2A_SCOPE}</p>
            <div className="protocol-flow mono">
              <span>Agent Card</span>
              <ArrowRight className="icon" aria-hidden="true" />
              <span className="policy-step">message</span>
              <ArrowRight className="icon" aria-hidden="true" />
              <span>model</span>
            </div>
            <TextLink href="/api#agents">Explore A2A scope</TextLink>
          </article>
        </div>
      </section>
      <section className="evidence-section container" aria-labelledby="compare-teaser-title">
        <div className="evidence-copy">
          <Eyebrow>OPEN CODE. CLEAR TRADE-OFFS.</Eyebrow>
          <h2 id="compare-teaser-title">
            Find your fit.
            <br />
            <span>Check the evidence.</span>
          </h2>
          <p>
            Compare architecture, capabilities, and edition boundaries across OmniSwitch and other
            AI gateways. Every comparison links to its sources.
          </p>
          <TextLink href="/compare" data-component-id="homepage-compare">
            Explore the comparison
          </TextLink>
        </div>
        <div className="evidence-register">
          <div className="register-heading mono">
            <span>OMNISWITCH / CAPABILITY REGISTER</span>
            <ArrowUpRight className="icon" aria-hidden="true" />
          </div>
          {teaserRows.map((row) => (
            <div className="register-row" key={row}>
              <span>{capabilityName(row)}</span>
              <ClaimCell gateway="omniswitch" capability={row} />
            </div>
          ))}
          <p className="register-date mono">
            REVIEWED {displayDate(latestReview(teaserRows, ['omniswitch']))}
          </p>
        </div>
      </section>
      <section className="beta-section container" id="beta" aria-labelledby="scope-title">
        <div className="beta-heading">
          <div>
            <Pill>Public beta</Pill>
            <h2 id="scope-title">
              Built in the open.
              <br />
              Clear about the edges.
            </h2>
          </div>
          <TextLink href="/roadmap" data-component-id="beta-roadmap">
            Read the roadmap
          </TextLink>
        </div>
        <div className="beta-columns">
          {status.columns.map((column, index) => (
            <div key={column.key}>
              <span className="mono beta-index">0{index + 1} /</span>
              <h3>{column.home_title}</h3>
              <p>{column.summary}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="switch-cta" aria-labelledby="start-title">
        <div className="container cta-inner">
          <div className="cta-copy">
            <Eyebrow>
              <Radio className="icon" aria-hidden="true" /> YOUR NEXT REQUEST STARTS HERE
            </Eyebrow>
            <h2 id="start-title">
              Make the switch.
              <br />
              <span>Keep the control.</span>
            </h2>
            <p>Run the gateway. Set the rules. Build what’s next.</p>
            <div className="hero-actions">
              <Button href="/quickstart" variant="primary" arrow data-component-id="bottom-run">
                Run OmniSwitch
              </Button>
              <Button href={repoUrl} data-component-id="bottom-github">
                <GitFork className="icon" aria-hidden="true" /> Build with us
              </Button>
            </div>
          </div>
          <div className="giant-switch" aria-hidden="true">
            <div className="giant-switch-knob">
              <img src="/favicon.svg" width="88" height="84" alt="" />
            </div>
            <span className="mono">YOU’RE IN CONTROL</span>
          </div>
        </div>
      </section>
    </div>
  )
}
