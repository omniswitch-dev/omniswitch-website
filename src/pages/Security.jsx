import PageShell, { PageSection, NextSteps } from '../components/PageShell.jsx'
import { CodePanel, TextLink } from '../components/UI.jsx'
import { productDoc, repoUrl, A2A_SCOPE } from '../data/product.js'

export default function Security() {
  return (
    <PageShell
      eyebrow="Security starts with ownership"
      title="Set a boundary you can verify."
      lede="Run the control plane yourself, apply local gateway policy, and evaluate model, tool, and agent access within the documented beta scope."
    >
      <PageSection id="report" title="Report privately">
        <p>
          Please do not open a public issue for a suspected vulnerability. Use GitHub’s private
          reporting flow or email{' '}
          <a href="mailto:security@omniswitch.dev">security@omniswitch.dev</a>. Include the impact,
          reproduction steps, affected version or commit, and any suggested remediation. Do not send
          production credentials.
        </p>
        <TextLink href={`${repoUrl}/security/advisories/new`}>
          Report a vulnerability privately
        </TextLink>
      </PageSection>
      <PageSection id="versions" title="Supported versions">
        <p>
          The product security policy defines these support boundaries. The v0.2.0 release is not
          assumed to be published by this page.
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <caption>Beta support policy</caption>
            <thead>
              <tr>
                <th scope="col">Version</th>
                <th scope="col">Policy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">0.2.x (beta)</th>
                <td>Full beta support, when available</td>
              </tr>
              <tr>
                <th scope="row">0.1.0</th>
                <td>Critical fixes only</td>
              </tr>
              <tr>
                <th scope="row">Unreleased main</th>
                <td>Best effort</td>
              </tr>
              <tr>
                <th scope="row">Older versions</th>
                <td>Not supported</td>
              </tr>
            </tbody>
          </table>
        </div>
      </PageSection>
      <PageSection id="response" title="Response targets">
        <p>
          These are the targets in the product’s coordinated-disclosure policy, not a service-level
          agreement.
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <caption>Security reporting targets</caption>
            <thead>
              <tr>
                <th scope="col">Milestone</th>
                <th scope="col">Target</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Acknowledgment</th>
                <td>Within 3 business days</td>
              </tr>
              <tr>
                <th scope="row">Triage & severity assessment</th>
                <td>Within 7 days</td>
              </tr>
              <tr>
                <th scope="row">High / Critical fix</th>
                <td>Within 30 days</td>
              </tr>
              <tr>
                <th scope="row">Medium / Low fix</th>
                <td>Best effort, scheduled into a normal release</td>
              </tr>
            </tbody>
          </table>
        </div>
      </PageSection>
      <PageSection id="hardening" title="Before exposing a gateway">
        <ul>
          <li>
            Enable gateway authentication; replace the bootstrap key with a personal admin key.
          </li>
          <li>Scope gateway keys by role and workspace. Set budgets and request limits.</li>
          <li>
            Keep provider secrets in environment variables or the provider vault, not checked-in
            YAML.
          </li>
          <li>Leave payload logging off unless an explicit debugging need justifies it.</li>
          <li>
            Use API-key-scoped caching; global scope can mix tenant-independent content by design.
          </li>
          <li>
            Terminate TLS, restrict ingress, back up your data, and review retention before
            upgrading.
          </li>
          <li>
            Verify release signatures and attestations when the signed v0.2.0 artifacts are
            published.
          </li>
        </ul>
        <CodePanel
          title="A safer configuration baseline"
          language="YAML"
          code="gateway:\n  auth: true\n  cache_scope: api_key\n  log_payloads: false"
        />
        <TextLink href={productDoc('docs/DEPLOYMENT.md')}>Deployment and hardening guide</TextLink>
      </PageSection>
      <PageSection id="scope" title="Know the scope">
        <p>
          The policy documents operator-selected insecure modes—authentication off, global caching,
          payload logging, or existing host/process access—as distinct from an unexpected security
          bypass. Report a way to trigger those behaviors without the operator’s opt-in.
        </p>
        <aside className="notice">
          <h3>What we do not claim</h3>
          <p>
            No security certification, complete enterprise identity suite, dashboard SSO, admin
            audit trail, mTLS, SAML, or SCIM. Local guardrails do not eliminate every attack. MCP
            and A2A remain Beta.
          </p>
          <p>A2A: {A2A_SCOPE}</p>
        </aside>
        <TextLink href={productDoc('SECURITY.md')}>Read the full security policy</TextLink>
      </PageSection>
      <NextSteps />
    </PageShell>
  )
}
