import { claims, claimSource, registerUrl } from '../data/comparison.js'

export default function SourceList({ columns, competitors, rows }) {
  return (
    <ol className="source-list">
      {columns
        .filter((c) => c.footnote)
        .map((column) => {
          const competitor = competitors.find((c) => c.primary === column.id)
          const gatewayIds = [column.id, ...(competitor?.editions.map((e) => e.id) || [])]
          const records = claims.claims.filter(
            (c) => gatewayIds.includes(c.gateway) && (!rows || rows.includes(c.capability)),
          )
          const urls = new Map()
          for (const source of competitor?.sources || [])
            urls.set(source.url, { label: source.label, date: source.accessed, kind: 'Accessed' })
          for (const context of competitor?.context || [])
            urls.set(context.source, {
              label: context.title,
              date: context.accessed,
              kind: 'Accessed',
            })
          for (const claim of records) {
            const url = claimSource(claim)
            if (!urls.has(url))
              urls.set(url, {
                label: claim.source_url || 'Pinned register (no capability-specific source)',
                date: claim.verified_on,
                kind: 'Register verified',
              })
          }
          return (
            <li key={column.id} className="source-item" id={`source-${column.footnote}`}>
              <span className="source-num">[{column.footnote}]</span>
              <div>
                <h3>{column.name}</h3>
                <p>
                  {column.id === 'omniswitch'
                    ? `Product register ${claims.source.commit.slice(0, 7)}. Cells reflect registered source claims, not roadmap plans or release-artifact availability; each retains its own verified date and version.`
                    : `${column.note}. Capability-specific documentation and dated editorial sources remain separate from independent testing.`}
                </p>
                <details className="source-expander">
                  <summary>
                    Read {urls.size} cited source{urls.size === 1 ? '' : 's'}
                  </summary>
                  <ul className="source-links">
                    {[...urls].map(([url, source]) => (
                      <li key={url}>
                        <a href={url}>{source.label}</a>
                        <time dateTime={source.date}>
                          {source.kind} {source.date}
                        </time>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </li>
          )
        })}
    </ol>
  )
}

export function Methodology() {
  return (
    <p className="source-policy">
      Supported means documented within the named capability and deployment scope, not full product
      parity. Beta and licensed editions are shown when the register supplies a qualifier. Not
      verified describes an evidence gap, not absence. Claims come from the{' '}
      <a href={registerUrl}>pinned register</a>; cells have no scores or totals. This is a dated
      documentation review, not a performance test or a security certification. See the{' '}
      <a href="/benchmarks">benchmark methodology</a>.
    </p>
  )
}
