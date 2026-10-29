import PageShell, { PageSection } from '../components/PageShell.jsx'
import { CodePanel, TextLink } from '../components/UI.jsx'
import { productDoc, repoUrl } from '../data/product.js'

export default function Security() {
  return (
    <PageShell
      eyebrow="PROJECT"
      title="Security"
      lede="Configure access, protect credentials, and report vulnerabilities privately."
    >
      <PageSection id="hardening" title="Deployment baseline">
        <p>
          Enable authentication, scope gateway keys to the workloads that need them, and configure
          request limits and budgets. Keep provider secrets in environment variables or the provider
          vault.
        </p>
        <CodePanel
          title="Gateway settings"
          language="YAML"
          code="gateway:\n  auth: true\n  cache_scope: api_key\n  log_payloads: false"
        />
        <p>
          Before accepting remote traffic, configure TLS termination, restrict ingress, and review
          data retention and backups.
        </p>
        <TextLink href={productDoc('docs/DEPLOYMENT.md')}>Deployment & hardening guide</TextLink>
      </PageSection>
      <PageSection id="report" title="Report a vulnerability">
        <p>
          Use GitHub private vulnerability reporting or email{' '}
          <a href="mailto:security@omniswitch.dev">security@omniswitch.dev</a>. Include the affected
          version, impact, and reproduction steps. Keep exploit details and credentials out of
          public issues.
        </p>
        <TextLink href={`${repoUrl}/security/advisories/new`}>Report privately</TextLink>
      </PageSection>
      <PageSection id="scope" title="Support & scope">
        <p>
          OmniSwitch is in public beta. Version support, response targets, and disclosure procedures
          are maintained in the project security policy. Review API and guardrail limitations for
          your deployment.
        </p>
        <div className="guide-actions">
          <TextLink href={productDoc('SECURITY.md')}>Security policy</TextLink>
          <TextLink href={productDoc('docs/KNOWN_LIMITATIONS.md')}>Known limitations</TextLink>
        </div>
      </PageSection>
    </PageShell>
  )
}
