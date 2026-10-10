import {
  Activity,
  Check,
  GitBranch,
  KeyRound,
  Layers,
  Server,
  Shield,
  Terminal,
} from 'lucide-react'
import {
  Button,
  Card,
  CodePanel,
  Eyebrow,
  Pill,
  SectionHeading,
  TextLink,
} from '../components/UI.jsx'
import { ClaimCell } from '../components/Matrix.jsx'
import { latestReview, displayDate, capabilityName } from '../data/comparison.js'
import { A2A_SCOPE } from '../data/product.js'
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
const controls = [
  {
    Icon: KeyRound,
    title: 'Control who gets access.',
    body: 'Issue API keys with per-key budgets. Scope access with roles and workspace boundaries.',
    proof: 'Hashed keys · budgets · rate limits',
  },
  {
    Icon: Shield,
    title: 'Check what passes through.',
    body: 'Run local PII, injection, and secret checks. Configure deny and redact actions.',
    proof: 'Built-in checks · regex · redaction',
  },
  {
    Icon: Activity,
    title: 'Know what happened.',
    body: 'Inspect request traces and guardrail events. Export telemetry to your observability stack.',
    proof: 'SQLite logs · Prometheus · OTLP',
  },
]

function Architecture() {
  return (
    <figure
      className="architecture"
      aria-label="Request architecture: your app passes through the self-hosted OmniSwitch gateway to a configured cloud or local model endpoint."
    >
      <div className="diagram-top">
        <span className="mono">ONE REQUEST. YOUR RULES.</span>
        <span className="outline-label">Architecture</span>
      </div>
      <div className="app-node">
        <Terminal className="icon" aria-hidden="true" />
        Your app / OpenAI SDK
      </div>
      <div className="wire" aria-hidden="true" />
      <div className="boundary">
        <div className="boundary-label">
          <Server className="icon" aria-hidden="true" />
          Your infrastructure
        </div>
        <div className="gateway-name">
          <span className="logo-tile">
            <Shield className="icon" aria-hidden="true" />
          </span>
          OmniSwitch<small>Self-hosted gateway</small>
        </div>
        <div className="pipeline">
          {[
            [KeyRound, 'Authenticate'],
            [Shield, 'Guard'],
            [GitBranch, 'Route'],
            [Activity, 'Observe'],
          ].map(([Icon, label]) => (
            <div className="pipeline-step" key={label}>
              <Icon className="icon" aria-hidden="true" />
              {label}
            </div>
          ))}
        </div>
        <div className="config-strip mono">
          <span>
            auth: <b>true</b>
          </span>
          <span>
            cache_scope: <b>api_key</b>
          </span>
          <span>
            log_payloads: <b>false</b>
          </span>
        </div>
      </div>
      <div className="wire" aria-hidden="true" />
      <div className="upstream-grid">
        <div className="upstream">
          Cloud providers<small>Native adapters</small>
        </div>
        <div className="upstream">
          Local models<small>OpenAI-compatible</small>
        </div>
      </div>
      <figcaption className="diagram-caption">
        Example configuration. Requests go to the upstreams you choose.
      </figcaption>
    </figure>
  )
}

export default function Home() {
  return (
    <>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="container hero-inner">
          <div className="hero-copy">
            <Eyebrow>Self-hosted AI. Security in your hands.</Eyebrow>
            <h1 id="hero-title" tabIndex={-1}>
              Your AI.
              <br />
              Under your
              <br />
              <span>control.</span>
            </h1>
            <p className="hero-description">
              Secure and route AI traffic through a gateway you run. Keep keys, local guardrails,
              budgets, and request traces in your own infrastructure.
            </p>
            <div className="hero-actions">
              <Button href="/quickstart" variant="primary" arrow data-component-id="hero-run">
                Run OmniSwitch
              </Button>
              <Button href="/docs" data-component-id="hero-docs">
                Explore the docs
              </Button>
            </div>
            <div className="hero-note">
              <GitBranch className="icon" aria-hidden="true" />
              Apache-2.0 <span>·</span> No cloud control plane
            </div>
          </div>
          <Architecture />
        </div>
      </section>
      <section className="foundation" aria-label="Deployment fundamentals">
        <div className="container foundation-inner">
          <p className="foundation-intro">
            <b>Own the control layer.</b>
            <br /> Keep the deployment simple.
          </p>
          <div className="foundation-facts">
            <div className="fact">
              <b>One Go binary</b>
              <span>Binary, Docker, or Kubernetes</span>
            </div>
            <div className="fact">
              <b>SQLite built in</b>
              <span>Redis optional for shared rate limits</span>
            </div>
            <div className="fact">
              <b>Apache-2.0</b>
              <span>Inspect it. Run it. Make it yours.</span>
            </div>
          </div>
        </div>
      </section>
      <section className="controls container" id="control" aria-labelledby="control-title">
        <div className="section-top">
          <SectionHeading
            eyebrow="01 / Secure self-hosted control"
            title={
              <>
                Set the boundaries.
                <br />
                See what crosses them.
              </>
            }
            id="control-title"
          >
            Policy, visibility, and ownership where your AI traffic meets your infrastructure.
          </SectionHeading>
          <TextLink href="/security" data-component-id="control-security">
            Explore security
          </TextLink>
        </div>
        <div className="control-grid">
          {controls.map(({ Icon, title, body, proof }) => (
            <Card className="control-card" key={title}>
              <Icon className="icon" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{body}</p>
              <div className="card-proof mono">{proof}</div>
            </Card>
          ))}
        </div>
      </section>
      <section className="routing" id="routing" aria-labelledby="routing-title">
        <div className="container">
          <div className="routing-layout">
            <SectionHeading
              eyebrow="02 / Universal AI gateway"
              title={
                <>
                  Your SDK.
                  <br />A different base URL.
                </>
              }
              id="routing-title"
            >
              Use OpenAI-compatible clients across native provider adapters and custom endpoints.
              Keep routing decisions in the gateway, not scattered through your app.
            </SectionHeading>
            <CodePanel
              title="Client configuration"
              language="Python"
              code={clientCode}
              footer="Set GATEWAY_URL to your gateway’s /v1 endpoint."
            >
              <>
                <span className="kw">from</span>
                {' openai '}
                <span className="kw">import</span>
                {' OpenAI\n\nclient = OpenAI(\n    '}
                <span className="kw">base_url</span>
                {
                  '=GATEWAY_URL,\n    api_key=OMNISWITCH_KEY,\n)\n\nresponse = client.chat.completions.create(\n    model='
                }
                <span className="str">"gpt-4o-mini"</span>
                {',\n    messages=[{"role": "user",\n               "content": "Hello"}],\n)'}
              </>
            </CodePanel>
            <div className="routing-features">
              <ul className="feature-list">
                {[
                  'Fallback chains, retries, and timeouts',
                  'Weighted routes and CEL conditions',
                  'Hot-reload routes without a restart',
                ].map((feature) => (
                  <li key={feature}>
                    <Check className="icon" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <TextLink href="/quickstart" data-component-id="routing-quickstart">
                Follow the quickstart
              </TextLink>
            </div>
          </div>
          <div className="providers">
            <div className="provider-label">Native provider adapters</div>
            <div className="provider-list">
              {[
                'OpenAI',
                'Anthropic',
                'Google Gemini',
                'Groq',
                'Azure OpenAI',
                'AWS Bedrock',
                'Cohere',
              ].map((provider) => (
                <span key={provider}>{provider}</span>
              ))}
              <p className="provider-extra">
                Plus OpenAI-compatible endpoints, including Ollama and vLLM. Responses and Messages
                APIs are documented subsets.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="agents" id="agents" aria-labelledby="agents-title">
        <div className="container agents-inner">
          <div>
            <SectionHeading
              eyebrow="03 / Governed agent infrastructure"
              title={
                <>
                  Beyond model calls.
                  <br />
                  Into agent workflows.
                </>
              }
              id="agents-title"
            >
              Bring tool access and agent messages into a policy-aware gateway. Start with the MCP
              and A2A capabilities available in beta.
            </SectionHeading>
            <TextLink href="/api#agents" data-component-id="agents-api">
              Explore agent protocols
            </TextLink>
          </div>
          <div className="agent-panel">
            <Card className="agent-card">
              <div className="agent-card-top">
                <Layers className="icon" aria-hidden="true" />
                <h3>Govern MCP tool access</h3>
                <Pill />
              </div>
              <p>
                Federate tool discovery and gate tool calls with policy across HTTP, SSE, and
                persistent stdio targets.
              </p>
              <div className="mono">tools/list → policy → tools/call</div>
            </Card>
            <Card className="agent-card">
              <div className="agent-card-top">
                <GitBranch className="icon" aria-hidden="true" />
                <h3>Governed A2A model access</h3>
                <Pill />
              </div>
              <p>{A2A_SCOPE}</p>
              <div className="mono">Agent Card → message → model pipeline</div>
            </Card>
          </div>
        </div>
      </section>
      <section className="compare-teaser container" aria-labelledby="compare-teaser-title">
        <div className="teaser-panel">
          <div>
            <Eyebrow>Choose for your architecture</Eyebrow>
            <h2 id="compare-teaser-title">How OmniSwitch compares.</h2>
            <p>
              Explore the trade-offs across LiteLLM, Portkey, Helicone, Kong, Cloudflare, and Agent
              Router. Compare capabilities, deployment models, and beta boundaries.
            </p>
            <div className="teaser-states">
              {teaserRows.map((row) => (
                <div className="teaser-state" key={row}>
                  <span>{capabilityName(row)}</span>
                  <ClaimCell gateway="omniswitch" capability={row} />
                </div>
              ))}
            </div>
            <div className="teaser-date">
              OmniSwitch register · Reviewed {displayDate(latestReview(teaserRows, ['omniswitch']))}
            </div>
          </div>
          <Button href="/compare" arrow data-component-id="homepage-compare">
            Explore the comparison
          </Button>
        </div>
      </section>
      <section className="scope" id="beta" aria-labelledby="scope-title">
        <div className="container">
          <div className="scope-head">
            <h2 id="scope-title">
              <Pill>Public beta</Pill>Clear about what’s here.
            </h2>
            <TextLink href="/roadmap" data-component-id="beta-roadmap">
              Read the roadmap
            </TextLink>
          </div>
          <div className="scope-columns">
            {status.columns.map((column) => (
              <div className="scope-column" key={column.key}>
                <h3>
                  <span className="status-dot" aria-hidden="true" />
                  {column.home_title}
                </h3>
                <p>{column.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="start" aria-labelledby="start-title">
        <div className="container">
          <h2 id="start-title">Make your next AI request yours.</h2>
          <p>Run OmniSwitch on your infrastructure. Start with a governed request.</p>
          <div className="start-actions">
            <Button href="/quickstart" variant="primary" arrow data-component-id="bottom-run">
              Run OmniSwitch
            </Button>
            <Button href="/install" data-component-id="bottom-install">
              Read the install guide
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
