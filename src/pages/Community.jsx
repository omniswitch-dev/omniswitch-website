import PageShell, { PageSection, NextSteps } from '../components/PageShell.jsx'
import { Card, TextLink } from '../components/UI.jsx'
import { repoUrl, productDoc } from '../data/product.js'

export default function Community() {
  return (
    <PageShell
      eyebrow="Built in the open"
      title="Build the control layer with us."
      lede="Help make secure self-hosted AI practical: inspect the gateway, test representative workloads, and shape the boundaries of governed agent infrastructure."
    >
      <PageSection id="participate" title="Useful feedback beats inflated numbers">
        <div className="content-grid">
          <Card>
            <h3>Discuss the operating model</h3>
            <p>
              Share your deployment constraints, provider requirements, and policy workflows. There
              are no membership counts or invented testimonials here.
            </p>
            <TextLink href={`${repoUrl}/issues`}>Discuss a deployment question</TextLink>
          </Card>
          <Card>
            <h3>Report a reproducible issue</h3>
            <p>
              Include your version, sanitized config, expected behavior, and a minimal reproduction.
              Keep gateway keys and provider secrets private.
            </p>
            <TextLink href={`${repoUrl}/issues`}>Issues and beta feedback</TextLink>
          </Card>
          <Card>
            <h3>Contribute a focused change</h3>
            <p>
              Read the contribution guide, check existing issues, and include tests for a change in
              gateway behavior.
            </p>
            <TextLink href={productDoc('CONTRIBUTING.md')}>Contributing guide</TextLink>
          </Card>
          <Card>
            <h3>Start with a scoped task</h3>
            <p>
              Documentation, parameter conformance, policy tests, and install verification all help
              improve the beta.
            </p>
            <TextLink
              href={`${repoUrl}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`}
            >
              Good first issues
            </TextLink>
          </Card>
        </div>
      </PageSection>
      <PageSection id="security" title="Keep vulnerability reports private">
        <p>
          Use the private disclosure path for security-sensitive findings. Do not post exploit
          details, keys, vault contents, or sensitive traces in public issues.
        </p>
        <TextLink href="/security">Security reporting</TextLink>
      </PageSection>
      <PageSection id="roadmap" title="Follow what is real">
        <p>
          The roadmap separates implemented capabilities, unreleased work, and deferred ideas.
          Benchmark results remain pending until a reproducible measurement campaign is published.
        </p>
        <div className="next-steps">
          <TextLink href="/roadmap">Roadmap</TextLink>
          <TextLink href="/benchmarks">Benchmark methodology</TextLink>
          <TextLink href="/compare">Source-backed comparisons</TextLink>
        </div>
      </PageSection>
      <NextSteps />
    </PageShell>
  )
}
