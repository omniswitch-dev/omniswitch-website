import PageShell, { PageSection } from '../components/PageShell.jsx'
import { TextLink } from '../components/UI.jsx'
import { productDoc, repoUrl } from '../data/product.js'

const guides = [
  [
    'routing',
    'Routing & providers',
    'Configure providers, fallback chains, retries, timeouts, and weighted routes.',
    'docs/CONFIGURATION.md',
  ],
  [
    'guardrails',
    'Guardrails & access',
    'Set authentication, local checks, request limits, and key budgets.',
    'docs/CONFIGURATION.md',
  ],
  [
    'mcp',
    'MCP tools',
    'Connect HTTP, SSE, and stdio targets. Configure discovery and tool-call policies.',
    'docs/API.md',
  ],
  [
    'observability',
    'Logs & telemetry',
    'Inspect requests and export metrics and traces to your monitoring stack.',
    'docs/OBSERVABILITY.md',
  ],
  [
    'deployment',
    'Deployment',
    'Choose a binary, Docker, or Kubernetes setup, then configure storage and networking.',
    'docs/DEPLOYMENT.md',
  ],
]

export default function Docs() {
  return (
    <PageShell
      eyebrow="DEVELOPERS"
      title="Documentation"
      lede="Start locally, configure your gateway, and connect it to your stack."
    >
      <PageSection id="quickstart" title="Start here">
        <p>
          The quickstart walks through a local source build, an authenticated gateway, and a first
          model request.
        </p>
        <TextLink href="/quickstart">Follow the quickstart</TextLink>
      </PageSection>
      <div className="guide-list">
        {guides.map(([id, title, description, path]) => (
          <section className="guide-row" key={id} id={id}>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
            <TextLink href={productDoc(path)} aria-label={`Read ${title} guide`}>
              Read guide
            </TextLink>
          </section>
        ))}
      </div>
      <PageSection id="scope" title="Current scope">
        <p>
          OmniSwitch is in public beta. API support and deployment requirements vary by version.
          Review the documented scope for the build you run.
        </p>
        <div className="guide-actions">
          <TextLink href={productDoc('docs/KNOWN_LIMITATIONS.md')}>Known limitations</TextLink>
          <TextLink href={`${repoUrl}/releases`}>Releases</TextLink>
          <TextLink href={repoUrl}>Source & contributions</TextLink>
        </div>
      </PageSection>
    </PageShell>
  )
}
