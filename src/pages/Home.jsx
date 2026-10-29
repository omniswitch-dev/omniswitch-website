import { Activity, ArrowRight, Boxes, GitBranch, GitFork, ShieldCheck } from 'lucide-react'
import { Button, CodePanel, TextLink } from '../components/UI.jsx'
import { repoUrl } from '../data/product.js'
import './Home.css'

const clientCode = `import os
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key=os.environ["OMNISWITCH_KEY"],
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello"}],
)`

const capabilities = [
  {
    Icon: GitBranch,
    title: 'LLM routing',
    description:
      'Connect cloud and local models through an OpenAI-compatible endpoint. Configure fallbacks, retries, and weighted routes in the gateway.',
    href: '/docs#routing',
    link: 'Routing documentation',
  },
  {
    Icon: ShieldCheck,
    title: 'Guardrails & access',
    description:
      'Apply local PII and injection checks. Control access with gateway keys, and set budgets and request limits for your workloads.',
    href: '/security',
    link: 'Security overview',
  },
  {
    id: 'agents',
    Icon: Boxes,
    title: 'MCP tools',
    description:
      'Bring HTTP, SSE, and stdio targets behind one MCP gateway. Federate tool discovery and apply policy to tool calls.',
    href: '/api#agents',
    link: 'MCP & A2A documentation',
  },
  {
    Icon: Activity,
    title: 'Request visibility',
    description:
      'Inspect request logs and guardrail events. Export metrics with Prometheus and traces with OTLP to your existing observability stack.',
    href: '/docs#observability',
    link: 'Observability documentation',
  },
]

function GatewayFlow() {
  return (
    <figure className="gateway-flow" aria-label="OmniSwitch request path">
      <div className="flow-endpoint">
        <span className="flow-label">YOUR APPLICATION</span>
        <span>Apps, SDKs & agents</span>
      </div>
      <ArrowRight className="flow-arrow" aria-hidden="true" />
      <div className="flow-gateway">
        <img src="/brand/omniswitch-mark.svg" width="25" height="25" alt="" />
        <span>OmniSwitch</span>
      </div>
      <ArrowRight className="flow-arrow" aria-hidden="true" />
      <div className="flow-endpoint">
        <span className="flow-label">YOUR UPSTREAMS</span>
        <span>Models & MCP tools</span>
      </div>
    </figure>
  )
}

export default function Home() {
  return (
    <div className="home">
      <section className="home-hero container" id="top" aria-labelledby="hero-title">
        <a href="/docs#scope" className="hero-release">
          <span className="release-dot" />
          Open source · Public beta
          <ArrowRight className="icon" aria-hidden="true" />
        </a>
        <h1 id="hero-title" tabIndex={-1}>
          One gateway for
          <br />
          <span>models and tools.</span>
        </h1>
        <p className="hero-description">
          Route LLM requests, apply guardrails, and connect MCP tools through one self-hosted AI
          gateway.
        </p>
        <div className="hero-actions">
          <Button href="/quickstart" variant="primary" arrow data-component-id="hero-run">
            Get started
          </Button>
          <Button href={repoUrl} data-component-id="hero-github">
            <GitFork className="icon" aria-hidden="true" /> View on GitHub
          </Button>
        </div>
        <p className="hero-note">A single Go binary. SQLite built in. Apache-2.0.</p>
        <GatewayFlow />
      </section>
      <section
        className="capabilities-section container"
        id="control"
        aria-labelledby="capabilities-title"
      >
        <div className="home-section-heading">
          <span className="section-kicker">THE GATEWAY</span>
          <h2 id="capabilities-title">AI traffic, under your control.</h2>
          <p>Keep routing, policies, and request data in your own infrastructure.</p>
        </div>
        <div className="capability-grid">
          {capabilities.map(({ id, Icon, title, description, href, link }) => (
            <article className="capability" id={id} key={title}>
              <Icon className="capability-icon" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
              <TextLink href={href}>{link}</TextLink>
            </article>
          ))}
        </div>
      </section>
      <section className="client-section" id="routing" aria-labelledby="client-title">
        <div className="container client-layout">
          <div className="client-copy">
            <span className="section-kicker">FOR DEVELOPERS</span>
            <h2 id="client-title">Use the client you already know.</h2>
            <p>
              Point your OpenAI-compatible client at OmniSwitch. Manage provider selection and
              routing in the gateway.
            </p>
            <p className="client-providers">
              OpenAI · Anthropic · Gemini · Azure · Bedrock
              <br />
              Plus Groq, Cohere, and custom endpoints.
            </p>
            <TextLink href="/quickstart" data-component-id="routing-quickstart">
              Send your first request
            </TextLink>
          </div>
          <div className="client-example">
            <CodePanel title="Connect your application" language="Python" code={clientCode} />
            <p>
              Example assumes a local gateway is running.{' '}
              <a href="/api">Review API compatibility</a>.
            </p>
          </div>
        </div>
      </section>
      <section className="start-section container" id="beta" aria-labelledby="start-title">
        <div>
          <span className="section-kicker">GET STARTED</span>
          <h2 id="start-title">Run it on your infrastructure.</h2>
          <p>Follow the quickstart, explore the code, and choose the setup that fits your stack.</p>
          <p className="beta-note">
            OmniSwitch is in public beta. <a href="/docs#scope">Review the current scope</a>.
          </p>
        </div>
        <div className="start-actions">
          <Button href="/quickstart" variant="primary" arrow data-component-id="bottom-run">
            Read the quickstart
          </Button>
          <TextLink href="/quickstart#install">Installation options</TextLink>
        </div>
      </section>
    </div>
  )
}
