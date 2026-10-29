import PageShell, { PageSection, NextSteps } from '../components/PageShell.jsx'
import { Pill } from '../components/UI.jsx'
import roadmap from '../data/roadmap.json'
import release from '../data/release.json'
import { getClaim, capabilityName } from '../data/comparison.js'
import { A2A_SCOPE } from '../data/product.js'

export default function Roadmap() {
  const implemented = roadmap.shipped_capabilities.filter(
    (id) => getClaim('omniswitch', id)?.status === 'yes',
  )
  return (
    <PageShell
      eyebrow="Implemented ≠ planned"
      title="Roadmap"
      lede="Secure self-hosted control comes first, universal gateway coverage supports it, and governed agent infrastructure expands within an explicit scope."
      updated={roadmap.updated}
    >
      <PageSection id="implemented" title="Implemented in the pinned register">
        <Pill variant="stable">Verified register scope</Pill>
        <ul>
          {implemented.map((id) => (
            <li key={id}>{capabilityName(id)}</li>
          ))}
        </ul>
        <p>
          Only capabilities marked Supported in the OmniSwitch register appear here. Source,
          version, and date matter; use the full comparison for partial capabilities.
        </p>
      </PageSection>
      <PageSection
        id="near-term"
        title={release.published ? 'v0.2.0 release scope' : 'Near term / unreleased v0.2.0'}
      >
        <Pill>{release.published ? 'Review release notes' : 'In progress'}</Pill>
        <ul>
          {roadmap.near_term.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          This is a release work list, not evidence that a download or a published measurement
          exists.
        </p>
      </PageSection>
      <PageSection id="medium-term" title="Medium term / beyond v0.2.0">
        <Pill variant="soon">Planned</Pill>
        <ul>
          {roadmap.medium_term.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </PageSection>
      <PageSection id="long-term" title="Longer term / evaluate with real workloads">
        <Pill variant="soon">Deferred</Pill>
        <ul>
          {roadmap.long_term.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>Current A2A (Beta): {A2A_SCOPE}</p>
      </PageSection>
      <PageSection id="boundaries" title="What this roadmap does not promise">
        <ul>
          {roadmap.not_promised.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </PageSection>
      <NextSteps />
    </PageShell>
  )
}
