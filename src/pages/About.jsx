import PageShell, { PageSection, NextSteps } from '../components/PageShell.jsx'
import { Card, TextLink } from '../components/UI.jsx'
import { A2A_SCOPE, repoUrl, productDoc } from '../data/product.js'

export default function About() {
  return (
    <PageShell
      eyebrow="AI infrastructure. Under your control."
      title="About OmniSwitch"
      lede="OmniSwitch is a secure self-hosted control plane, a universal AI gateway, and beta infrastructure for governed model, tool, and agent access."
    >
      <PageSection id="principles" title="A clear order of priorities">
        <div className="content-grid">
          <Card>
            <h3>01 / Self-hosted control</h3>
            <p>
              Run a compact Go gateway on your infrastructure. Inspect access, policy, budgets, and
              request traces rather than outsourcing the control plane.
            </p>
          </Card>
          <Card>
            <h3>02 / Universal AI gateway</h3>
            <p>
              Connect native provider adapters and OpenAI-compatible endpoints. Keep routing and
              reliability policy in the gateway, within documented API scope.
            </p>
          </Card>
          <Card>
            <h3>03 / Governed agents</h3>
            <p>
              MCP and A2A are Beta. Evaluate the real protocol boundaries, not a claim of complete
              orchestration.
            </p>
            <p>{A2A_SCOPE}</p>
          </Card>
          <Card>
            <h3>Open source, inspectable</h3>
            <p>
              Apache-2.0. One Go binary with SQLite built in; Redis is optional for shared
              rate-limit windows. You own deployment and operations.
            </p>
          </Card>
        </div>
      </PageSection>
      <PageSection id="maintainers" title="Built by the repository community">
        <p>
          Maintainers, contribution history, and technical decisions live in the product repository.
          No customer counts, testimonials, funding claims, or invented performance numbers are used
          here.
        </p>
        <div className="next-steps">
          <TextLink href={`${repoUrl}/graphs/contributors`}>Repository contributors</TextLink>
          <TextLink href={productDoc('LICENSE')}>Apache-2.0 license</TextLink>
          <TextLink href="/community">Get involved</TextLink>
        </div>
      </PageSection>
      <NextSteps />
    </PageShell>
  )
}
