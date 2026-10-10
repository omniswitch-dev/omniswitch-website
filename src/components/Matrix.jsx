import Link from './Link.jsx'
import { StateBadge } from './UI.jsx'
import { claimState } from '../data/claim-state.js'
import {
  claims,
  getClaim,
  getGateway,
  capabilityName,
  claimSource,
  registerUrl,
  latestReview,
  displayDate,
} from '../data/comparison.js'
import { A2A_SCOPE } from '../data/product.js'
import './Matrix.css'

export function ClaimCell({ gateway, capability }) {
  const claim = getClaim(gateway, capability)
  const product = getGateway(gateway)
  const state = claimState(claim, product)
  return (
    <div className="claim-cell">
      <details>
        <summary
          aria-label={`${capabilityName(capability)} for ${product?.name || gateway}: ${state.label}`}
        >
          <StateBadge state={state} />
        </summary>
        <div
          className="claim-evidence"
          data-claim-evidence="register"
          data-benchmark-evidence={
            capability === 'published-benchmarks' && claim?.status === 'yes' && claim.source_url
              ? 'cited-register'
              : undefined
          }
          data-capability={capability}
          data-gateway={gateway}
        >
          <p>
            {claim?.detail || 'No claim is recorded for this capability in the pinned register.'}
          </p>
          <dl>
            <div>
              <dt>Version</dt>
              <dd>{claim?.version || 'Not recorded'}</dd>
            </div>
            <div>
              <dt>Verified</dt>
              <dd>{claim?.verified_on || 'Not recorded'}</dd>
            </div>
          </dl>
          {!claim?.source_url && (
            <p>
              No capability-specific source was recorded. The register is the provenance, not proof
              of absence.
            </p>
          )}
          <a href={claimSource(claim)}>
            {claim?.source_url ? 'Open cited source' : 'Open pinned register'} ↗
          </a>
          {capability === 'published-benchmarks' && claim?.status === 'yes' && (
            <p>
              Published source claim, not an OmniSwitch measurement or an independently verified
              comparison.
            </p>
          )}
          {gateway === 'omniswitch' && capability.startsWith('a2a-') && (
            <p className="protocol-scope">Current protocol scope: {A2A_SCOPE}</p>
          )}
        </div>
      </details>
      {claim?.status === 'partial' && (
        <p className="claim-inline" data-claim-evidence="register">
          {claim.detail}
        </p>
      )}
    </div>
  )
}

export function Legend({ rows, columns }) {
  const states = new Map()
  for (const row of rows)
    for (const column of columns) {
      const state = claimState(getClaim(column.id, row), getGateway(column.id))
      states.set(state.key, state)
    }
  const order = ['supported', 'beta', 'enterprise', 'managed', 'partial', 'absent', 'unknown']
  return (
    <div className="legend" role="group" aria-label="Capability states">
      <span>READING THE MATRIX</span>
      {order
        .filter((key) => states.has(key))
        .map((key) => (
          <StateBadge key={key} state={states.get(key)} />
        ))}
    </div>
  )
}

export default function Matrix({ columns, rows, groups, mobile = true }) {
  const sections = groups || [{ name: null, capabilities: rows }]
  const allRows = sections.flatMap((group) => group.capabilities)
  return (
    <>
      <div className={`matrix-wrap ${mobile ? 'desktop-matrix' : ''}`}>
        <table className="capability-matrix">
          <caption className="sr-only">
            Dated AI gateway capability matrix, reviewed{' '}
            {displayDate(
              latestReview(
                allRows,
                columns.map((c) => c.id),
              ),
            )}
          </caption>
          <colgroup>
            <col className="feature-col" />
            {columns.map((c) => (
              <col key={c.id} className={c.id === 'omniswitch' ? 'own-col' : undefined} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Capability</th>
              {columns.map((c) => (
                <th scope="col" key={c.id}>
                  <span className="product-heading">
                    {c.slug ? <Link href={`/compare/${c.slug}`}>{c.name}</Link> : c.name}
                  </span>
                  {c.footnote && (
                    <Link
                      href={`#source-${c.footnote}`}
                      className="source-ref"
                      aria-label={`Source ${c.footnote} for ${c.name}`}
                    >
                      [{c.footnote}]
                    </Link>
                  )}
                  <small>{c.note}</small>
                </th>
              ))}
            </tr>
          </thead>
          {sections.map((group) => (
            <tbody key={group.name || 'capabilities'}>
              {group.name && (
                <tr className="matrix-group">
                  <th colSpan={columns.length + 1} scope="rowgroup">
                    {group.name}
                  </th>
                </tr>
              )}
              {group.capabilities.map((row) => (
                <tr key={row}>
                  <th scope="row">{capabilityName(row)}</th>
                  {columns.map((c) => (
                    <td key={c.id}>
                      <ClaimCell gateway={c.id} capability={row} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      {mobile && (
        <div className="mobile-matrix">
          {sections.map((group) => (
            <div key={group.name || 'capabilities'} className="mobile-matrix-group">
              {group.name && <h3 className="mobile-group-title">{group.name}</h3>}
              {group.capabilities.map((row) => (
                <article className="matrix-product matrix-capability" key={row}>
                  <header>
                    <h3>{capabilityName(row)}</h3>
                  </header>
                  <dl>
                    {columns.map((c) => (
                      <div key={c.id} className={c.id === 'omniswitch' ? 'own-row' : undefined}>
                        <dt>
                          {c.slug ? <Link href={`/compare/${c.slug}`}>{c.name}</Link> : c.name}
                          {c.footnote && (
                            <Link
                              href={`#source-${c.footnote}`}
                              aria-label={`Source ${c.footnote} for ${c.name}`}
                              className="mobile-source"
                            >
                              [{c.footnote}]
                            </Link>
                          )}
                        </dt>
                        <dd>
                          <ClaimCell gateway={c.id} capability={row} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export function MatrixScope({ gatewayIds = ['omniswitch'] }) {
  const scoped = claims.claims.filter(
    (c) => c.gateway === 'omniswitch' && ['partial', 'no'].includes(c.status),
  )
  return (
    <div className="matrix-notes">
      <p>
        <b>OmniSwitch scope.</b> The pinned register marks{' '}
        {scoped.map((c) => capabilityName(c.capability)).join(', ')} as partial or unavailable. Read
        each source and version; compare them with the build you actually deploy.
      </p>
      <p>
        <b>Read unknowns carefully.</b> “Not verified” means an evidence gap, not absence. Editions
        remain separate. <a href={registerUrl}>Register {claims.source.commit.slice(0, 7)}</a>;{' '}
        {gatewayIds.length} compared deployment{gatewayIds.length === 1 ? '' : 's'}.
      </p>
      <p className="a2a-scope">
        <b>A2A (Beta).</b> {A2A_SCOPE}
      </p>
    </div>
  )
}
