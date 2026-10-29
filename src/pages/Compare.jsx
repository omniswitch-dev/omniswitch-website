import { Button, Eyebrow, SectionHeading, TextLink } from '../components/UI.jsx'
import Matrix, { Legend, MatrixScope } from '../components/Matrix.jsx'
import SourceList, { Methodology } from '../components/SourceList.jsx'
import Link from '../components/Link.jsx'
import {
  claims,
  competitors,
  matrix,
  hubColumns,
  latestReview,
  displayDate,
  migrationEnabled,
} from '../data/comparison.js'
import './Compare.css'

export function MarketContext({ items }) {
  return (
    <div className="context-grid">
      {items.map((item) => (
        <article className="context-item" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <TextLink href={item.source}>Source · accessed {item.accessed}</TextLink>
        </article>
      ))}
    </div>
  )
}

export default function Compare() {
  const reviewed = latestReview(
    matrix.hub_rows,
    hubColumns.map((c) => c.id),
  )
  const migrations = competitors.filter(migrationEnabled)
  const contexts = ['helicone', 'portkey', 'envoy-ai-gateway'].flatMap(
    (slug) => competitors.find((c) => c.slug === slug).context,
  )
  return (
    <>
      <section className="compare-hero" aria-labelledby="compare-title">
        <div className="container">
          <div className="compare-hero-inner">
            <div className="compare-hero-copy">
              <Eyebrow>
                <Link href="/">OmniSwitch</Link> / Compare
              </Eyebrow>
              <h1 id="compare-title" tabIndex={-1}>
                Compare AI gateways
              </h1>
              <p>
                Compare deployment options, routing, security, and agent capabilities using dated
                product documentation.
              </p>
            </div>
            <aside className="compare-aside">
              <strong>Reviewed {displayDate(reviewed)}</strong>
              <span>
                OmniSwitch: register {claims.source.commit.slice(0, 7)}
                <br />
                Competitors: cited public documentation
                <br />
                Capability review. Not a benchmark.
                <br />
                Inspect source dates and versions.
              </span>
            </aside>
          </div>
          <nav className="compare-jumps" aria-label="On this page">
            <Button href="#capabilities" arrow data-component-id="jump-matrix">
              Compare capabilities
            </Button>
            <Button href="#fit" data-component-id="jump-fit">
              Find your fit
            </Button>
            <Button href="#migration" data-component-id="jump-migration">
              Migration starting points
            </Button>
          </nav>
        </div>
      </section>
      <section
        className="matrix-section container"
        id="capabilities"
        aria-labelledby="matrix-title"
      >
        <div className="compare-section-title">
          <div>
            <h2 id="matrix-title">Capability comparison</h2>
            <p>
              States describe the cited capability—not full product parity. Edition, deployment, and
              protocol scope matter. Open any state for its evidence.
            </p>
          </div>
          <TextLink href="#sources" data-component-id="matrix-sources">
            Source notes
          </TextLink>
        </div>
        <Legend rows={matrix.hub_rows} columns={hubColumns} />
        <Matrix rows={matrix.hub_rows} columns={hubColumns} />
        <MatrixScope gatewayIds={hubColumns.map((c) => c.id)} />
      </section>
      <section className="fit-section" id="fit" aria-labelledby="fit-title">
        <div className="container">
          <SectionHeading
            eyebrow="When to choose which"
            title="Which gateway fits your stack?"
            id="fit-title"
          >
            Operating model, ecosystem, governance, or an existing investment—not a universal
            winner.
          </SectionHeading>
          <article className="own-fit">
            <div>
              <Eyebrow>Where we fit</Eyebrow>
              <h3>
                Choose OmniSwitch for
                <br />
                self-hosted control.
              </h3>
            </div>
            <p>
              <b>A compact control layer</b>A single Go binary, local policy checks, scoped keys,
              budgets, and request traces. A fit when you want to inspect and operate the gateway
              yourself.
            </p>
            <p>
              <b>Know the current limits</b>Public beta, single-replica SQLite, and documented
              compatibility API subsets. No dashboard SSO or admin audit trail yet. Validate
              unreleased work separately.
            </p>
          </article>
          <div className="fit-grid">
            {competitors.map((c) => (
              <article className="fit-card" key={c.slug}>
                <h3>
                  <Link href={`/compare/${c.slug}`}>{c.name}</Link>
                  <Link
                    href={`#source-${c.footnote}`}
                    className="source-ref"
                    aria-label={`Source ${c.footnote} for ${c.name}`}
                  >
                    [{c.footnote}]
                  </Link>
                </h3>
                <strong>{c.fit.headline}</strong>
                <p>{c.fit.body}</p>
                <TextLink href={`/compare/${c.slug}`}>Read the full comparison</TextLink>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="migration-section" id="migration" aria-labelledby="migration-title">
        <div className="container">
          <SectionHeading
            eyebrow="Migration starting points"
            title="Migration starting points"
            id="migration-title"
          >
            A base URL change is a start—not a complete migration plan.
          </SectionHeading>
          <div className="migration-grid">
            {migrations.map((c) => (
              <article className="migration-card" key={c.slug}>
                <Eyebrow>From {c.name}</Eyebrow>
                <h3>{c.migration.headline}</h3>
                <ol>
                  {c.migration.checklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
                <TextLink
                  href={`/compare/${c.slug}#migration`}
                  data-component-id={`migration-${c.slug}`}
                >
                  Pilot one {c.name} workflow
                </TextLink>
              </article>
            ))}
          </div>
          <p className="migration-note">
            No competitor-header compatibility or automatic configuration/key import is implied.
            Keep your current gateway available until the pilot meets your requirements.
          </p>
        </div>
      </section>
      <section className="context-section" aria-labelledby="context-title">
        <div className="container">
          <div className="compare-section-title">
            <div>
              <h2 id="context-title">The market moves. Context matters.</h2>
              <p>
                Ownership and project names change; evaluate the current product and support model.
              </p>
            </div>
            <span className="review-date">As of 9 October 2026</span>
          </div>
          <MarketContext items={contexts} />
        </div>
      </section>
      <section className="sources-section container" id="sources" aria-labelledby="sources-title">
        <div className="compare-section-title">
          <div>
            <h2 id="sources-title">Sources & methodology</h2>
            <p>
              Register verification dates are shown per cell. Editorial context accessed 9 October
              2026. Not independently tested parity.
            </p>
          </div>
          <span className="review-date">Footnotes [1]–[7]</span>
        </div>
        <SourceList columns={hubColumns} competitors={competitors} rows={matrix.hub_rows} />
        <Methodology />
      </section>
      <section className="start compare-start" aria-labelledby="compare-start-title">
        <div className="container">
          <h2 id="compare-start-title">Does self-hosted control fit your stack?</h2>
          <p>Start with a local gateway and one representative request.</p>
          <div className="start-actions">
            <Button href="/quickstart" variant="primary" arrow data-component-id="compare-run">
              Run OmniSwitch
            </Button>
            <Button href="/docs" data-component-id="compare-docs">
              Read the docs
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
