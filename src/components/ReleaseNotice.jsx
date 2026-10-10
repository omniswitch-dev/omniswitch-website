import release from '../data/release.json'
import { Pill } from './UI.jsx'
import { A2A_SCOPE } from '../data/product.js'

export function ReleaseNotice() {
  return (
    !release.published && (
      <aside className="notice">
        <Pill>Pre-release</Pill>
        <p>
          <strong>{release.tag} is not published yet.</strong> The commands below build the pinned
          release-foundation source; they do not assume a beta tag, container image, or Homebrew
          update exists. Use this path for evaluation.
        </p>
      </aside>
    )
  )
}

export function KnownLimitations() {
  return (
    <aside className="notice limitations">
      <h3>Know the boundaries</h3>
      <ul>
        <li>
          Public beta. Validate the documented Responses and Messages API subsets against your
          workload.
        </li>
        <li>
          Use one replica with SQLite. Redis shares rate-limit windows, not keys, logs, or control
          state.{' '}
          {release.published
            ? 'Review the Postgres deployment requirements before using multiple replicas.'
            : 'Multi-replica Postgres deployment is part of the unreleased v0.2.0 work.'}
        </li>
        <li>A2A (Beta): {A2A_SCOPE}</li>
        <li>No dashboard SSO, admin audit log, MCP OAuth discovery, mTLS, SAML, or SCIM.</li>
        <li>Output guardrail buffering delays delivery until the stream has been scanned.</li>
        <li>
          The lexical similarity cache uses token-frequency cosine similarity, not embeddings.
        </li>
      </ul>
    </aside>
  )
}
