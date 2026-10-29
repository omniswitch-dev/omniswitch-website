import PageShell, { PageSection, NextSteps } from '../components/PageShell.jsx'
import { CodePanel, TextLink } from '../components/UI.jsx'
import { ReleaseNotice } from '../components/ReleaseNotice.jsx'
import release from '../data/release.json'
import {
  archiveName,
  installCommand,
  dockerCommand,
  verificationCommand,
  productDoc,
  repoUrl,
} from '../data/product.js'

export default function Install() {
  const toc = [
    ['binary', 'Binary'],
    ['docker', 'Docker'],
    ['homebrew', 'Homebrew'],
    ['kubernetes', 'Kubernetes'],
    ['verify', 'Verify the download'],
    ['upgrade', 'Upgrade'],
    ['uninstall', 'Uninstall'],
  ]
  return (
    <PageShell
      eyebrow="Own the deployment"
      title="Install OmniSwitch"
      lede="Start with a secure self-hosted control plane. Choose a binary, a container, or Kubernetes, then connect clients and governed agent workflows."
      updated={release.updated}
      toc={toc}
    >
      <ReleaseNotice />
      <PageSection id="binary" title="Binary">
        <p>
          {release.published
            ? `The current published version is ${release.tag}.`
            : `The target is ${release.tag}; until it is published, build the pinned source instead of downloading a nonexistent archive.`}
        </p>
        <CodePanel
          title={release.published ? 'Install the published binary' : 'Build the evaluation binary'}
          language="Shell"
          code={installCommand()}
        />
        <p>
          Linux/macOS archives use{' '}
          <code>
            {archiveName('&lt;os&gt;', '&lt;arch&gt;')
              .replaceAll('&lt;', '<')
              .replaceAll('&gt;', '>')}
          </code>
          . The version segment has no <code>v</code> prefix. Select the architecture that matches
          your host.
        </p>
        {release.published && (
          <TextLink href={`${repoUrl}/releases/tag/${release.tag}`}>
            Download {release.tag}
          </TextLink>
        )}
      </PageSection>
      <PageSection id="docker" title="Docker">
        <p>
          {release.published
            ? 'Use the exact versioned image rather than relying on latest.'
            : 'Build a local image from the same source checkout. The v0.2.0 registry image is not assumed to exist.'}{' '}
          Create a private <code>.env.local</code> with your provider key,{' '}
          <code>OMNISWITCH_AUTH=true</code>, and <code>OMNISWITCH_BOOTSTRAP_API_KEY</code>. Keep it
          out of git.
        </p>
        <CodePanel
          title={release.published ? 'Run the versioned image' : 'Build and run locally'}
          language="Shell"
          code={dockerCommand()}
        />
        <p>
          The named volume preserves the gateway’s data. Configure authentication and network access
          before exposing the port beyond your machine.
        </p>
      </PageSection>
      <PageSection id="homebrew" title="Homebrew">
        <p>Homebrew tracks published stable releases, not source-branch evaluations.</p>
        {release.published ? (
          <CodePanel
            title="Install with Homebrew"
            language="Shell"
            code={`brew install ${release.homebrew}`}
          />
        ) : (
          <p>
            Use the source-build path above for this pre-release. The tap will be updated only after
            a verified stable release.
          </p>
        )}
      </PageSection>
      <PageSection id="kubernetes" title="Kubernetes">
        <p>
          The product checkout contains manifests, Kustomize configuration, and a Helm chart.
          Configure a bootstrap secret and provider credentials before deploying.
        </p>
        <CodePanel
          title="Inspect the chart before deploying"
          language="Shell"
          code="helm lint deploy/helm/omniswitch\nhelm template omniswitch deploy/helm/omniswitch"
        />
        <p>
          Use one replica with SQLite. The v0.2.0 Postgres multi-replica chart requires shared
          database configuration; Redis is for shared rate-limit windows, not a control-state store.
        </p>
        <TextLink href={productDoc('docs/DEPLOYMENT.md')}>Canonical deployment guide</TextLink>
      </PageSection>
      <PageSection id="verify" title="Verify the download">
        <p>
          {release.published
            ? 'The release publishes signed checksums, SBOMs, and GitHub build attestations.'
            : 'When v0.2.0 is published, its release is intended to include signed checksums, per-archive SBOMs, and GitHub build attestations. The commands below are prepared for that release; these files are not available yet.'}
        </p>
        <p>
          First verify the signature on <code>checksums.txt</code> with{' '}
          <code>cosign verify-blob</code>, pinned to the repository’s release workflow and GitHub
          OIDC issuer. Then verify your archive’s checksum and build provenance with{' '}
          <code>gh attestation verify</code>.
        </p>
        <CodePanel
          title={
            release.published
              ? 'Verify a Linux amd64 archive'
              : 'After publication: verify a Linux amd64 archive'
          }
          language="Shell"
          code={verificationCommand()}
        />
        <p>
          Do not proceed if any check fails. On macOS, use{' '}
          <code>shasum -a 256 -c checksums.txt</code> in a directory containing the selected
          archive; choose your platform’s release asset. Read the release’s final verification
          instructions for the signing asset names.
        </p>
        <TextLink href={productDoc('docs/RELEASES.md')}>Release verification policy</TextLink>
      </PageSection>
      <PageSection id="upgrade" title="Upgrade deliberately">
        <p>
          Back up your configuration, SQLite files or Postgres database, and provider vault before
          changing versions. Read the release notes and upgrade guide; do not treat a pre-1.0 minor
          release as automatically configuration-compatible.
        </p>
        <p>
          The v0.2.0 plan introduces versioned migrations and retention defaults of 30 days for
          request metadata and guardrail decisions, 7 days for payloads; <code>0</code> keeps data
          indefinitely. Review those settings before upgrading.
        </p>
        <TextLink href="/changelog">Read the release scope</TextLink>
      </PageSection>
      <PageSection id="uninstall" title="Uninstall">
        <p>
          Stop the process first. Remove the binary, or uninstall it with your package manager.
          Remove a container without deleting its volume unless you intend to delete gateway data.
        </p>
        <CodePanel
          title="Remove a locally built binary"
          language="Shell"
          code={release.commands.uninstall}
        />
        <p>
          Data removal is a separate, explicit step. Keep a backup before deleting any gateway
          database or Docker volume.
        </p>
      </PageSection>
      <NextSteps />
    </PageShell>
  )
}
