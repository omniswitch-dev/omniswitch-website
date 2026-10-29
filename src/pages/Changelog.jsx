import PageShell, { NextSteps } from '../components/PageShell.jsx'
import { Pill, TextLink } from '../components/UI.jsx'
import entries from '../data/changelog.json'
import release from '../data/release.json'
import { A2A_SCOPE, repoUrl, productDoc } from '../data/product.js'

export default function Changelog() {
  return (
    <PageShell
      eyebrow="Changes you can review"
      title="Changelog"
      lede="Follow the self-hosted control plane, gateway API coverage, and governed agent work. Unreleased scope is not presented as a published artifact."
    >
      {entries
        .filter(
          (entry) =>
            !release.published ||
            entry.state !== 'planned' ||
            !entry.version.startsWith(`${release.version}-`),
        )
        .map((entry) => {
          const published =
            entry.state === 'published' || (entry.version === release.version && release.published)
          return (
            <article className="release-entry" key={entry.version}>
              <h2>
                v{entry.version}
                <Pill variant={published ? 'stable' : 'beta'}>
                  {published ? 'Published' : entry.state === 'planned' ? 'Planned' : 'Unreleased'}
                </Pill>
              </h2>
              {entry.date && (
                <time dateTime={entry.date}>
                  {entry.date}
                  {!published && ' · scope reviewed, not a publication date'}
                </time>
              )}
              <h3>{entry.title}</h3>
              <ul>
                {entry.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                {published && entry.version === release.version
                  ? 'Read the published product release notes for the final changes and upgrade instructions.'
                  : entry.note}
              </p>
              {published && (
                <TextLink href={`${repoUrl}/releases/tag/v${entry.version}`}>
                  Read the product release
                </TextLink>
              )}
            </article>
          )
        })}
      <aside className="notice">
        <h3>The A2A boundary remains explicit</h3>
        <p>{A2A_SCOPE}</p>
      </aside>
      <TextLink href={productDoc('CHANGELOG.md')}>Canonical product changelog</TextLink>
      <NextSteps />
    </PageShell>
  )
}
