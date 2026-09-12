import React from 'react';
import benchmarks from './data/benchmarks.json';

function PendingTimeline({ items }) {
  return (
    <ul className="pending-timeline">
      {items.map((it, i) => (
        <li key={i} className={it.status === 'done' ? 'done' : it.status === 'now' ? 'now' : ''}>
          <i></i>
          <span>{it.label}<small>{it.detail}</small></span>
        </li>
      ))}
    </ul>
  );
}

function PublishedBenchmarks() {
  // Placeholder renderer for once results.json ships with state: "published".
  // Real per-scenario tables/charts land with Track B's report; this keeps the
  // page from breaking if `state` flips before that work is wired in.
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="section-badge">Benchmarks</div>
        <h1>Results are published</h1>
        <p>Results JSON reports state: "published" but the results renderer has not shipped yet. See BENCHMARKS.md for the latest numbers.</p>
      </div>
    </div>
  );
}

export default function Benchmarks() {
  const data = benchmarks;

  if (data.state === 'published') {
    return <PublishedBenchmarks data={data} />;
  }

  return (
    <div className="page-container" style={{ maxWidth: 1100 }}>
      <div className="page-header" style={{ textAlign: 'left', margin: 0 }}>
        <div className="section-badge">Benchmarks · Methodology {data.methodology_version}</div>
        <h1 style={{ fontSize: '2.4rem' }}>We have not published cross-gateway numbers yet. Here is exactly how we will.</h1>
        <p style={{ margin: 0, maxWidth: 720 }}>
          Plenty of gateways publish a speed number. Few publish the harness. The methodology below is frozen and public
          now; the first cross-gateway run lands once the harness is built, and every result will ship with raw data and
          a &ldquo;what this does not mean&rdquo; section. Until then, the only figures on this page are ones we have
          actually measured.
        </p>
      </div>

      <div className="page-section" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginTop: '2rem' }}>
        <aside className="run-card">
          <h4>First cross-gateway run <span className="pill pill-beta">not scheduled</span></h4>
          <dl className="run-kv">
            <dt>Compared</dt><dd>{data.run.compared}</dd>
            <dt>Machine</dt><dd>{data.run.machine}</dd>
            <dt>Harness</dt><dd>{data.run.harness}</dd>
            <dt>Tracking</dt><dd>{data.run.tracking}</dd>
          </dl>
        </aside>
      </div>

      <div className="pending-panel" style={{ marginTop: '2rem' }}>
        <div>
          <span className="pill pill-beta">Results pending</span>
          <h3>Cross-gateway comparison: not yet run</h3>
          <p>The table that will live here has fixed columns and fixed scenarios — see below — so the shape cannot be
          tuned after seeing results. Nothing about the layout or metric definitions changes between now and
          publication except through a numbered methodology revision.</p>
        </div>
        <PendingTimeline items={data.timeline} />
      </div>

      <div className="kpi-grid">
        {data.kpis.map((k, i) => (
          <div className="kpi-tile ghost" key={i}>
            <div className="l">{k.label}</div>
            <div className="v">&mdash;</div>
            <div className="d">{k.detail}</div>
          </div>
        ))}
      </div>

      <h2 className="page-section" style={{ marginBottom: '0.4rem' }}>What we have measured so far</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        One micro-benchmark, published with its limitations: guardrail pattern scanning, Rust-WASM accelerator versus
        the pure-Go fallback. Both paths return identical decisions.
      </p>
      <div className="bench-panel">
        <div className="ph">
          <span><b>{data.measured.title}</b></span>
          <span className="pill pill-soon">{data.measured.environment}</span>
        </div>
        <table className="bench-table">
          <thead><tr><th>Payload</th><th>Pure-Go path</th><th>Rust-WASM path</th><th>Speedup</th></tr></thead>
          <tbody>
            {data.measured.rows.map((r, i) => (
              <tr key={i}>
                <td className="name">{r.payload}</td>
                <td>{r.go}</td>
                <td>{r.wasm}</td>
                <td className="hi">{r.speedup}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bench-fnotes">
          <b>Reading:</b> {data.measured.reading} <b>Reproduce:</b> <code>{data.measured.reproduce}</code>{' '}
          <b>Source:</b> {data.measured.source}. These numbers will be re-run on the pinned rig once the cross-gateway
          harness runs.
        </div>
      </div>

      <h2 className="page-section" style={{ marginBottom: '0.4rem' }}>Planned scenarios (fixed before the run)</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Six scenarios, each with a named primary metric. Adding a scenario later is fine; changing a metric definition
        requires a methodology version bump.
      </p>
      <div className="scen-grid">
        {data.scenarios.map((s) => (
          <div className="scen-card" key={s.n}>
            <h4>{s.n} · {s.title} {s.primary && <span className="pill pill-new">primary</span>}</h4>
            <p>{s.desc}</p>
            <div className="m">Metric: <code>{s.metric}</code></div>
          </div>
        ))}
      </div>

      <h2 className="page-section" style={{ marginBottom: '0.4rem' }}>Methodology {data.methodology_version}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Frozen {data.methodology_frozen}. Changes are proposed as PRs to the harness repository and become v2.
      </p>
      <div className="meth-grid">
        {data.methodology.map((m, i) => (
          <div className="meth-card" key={i}>
            <h3>{m.title}</h3>
            <ul>{m.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
          </div>
        ))}
      </div>

      <div className="code-block" style={{ marginTop: '1.5rem' }}>
        <div className="code-header">{data.reproduce.note}</div>
        <pre><code>{data.reproduce.commands.join('\n')}</code></pre>
      </div>

      <h2 className="page-section" style={{ marginBottom: '0.4rem' }}>Caveats we will attach to every result</h2>
      <div className="caveats-grid">
        <div className="cav-card">
          <h3>Caveats</h3>
          <ol>{data.caveats.map((c, i) => <li key={i}>{c}</li>)}</ol>
        </div>
        <div className="cav-card no">
          <h3>Not claimed</h3>
          <ul>{data.not_claimed.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </div>
      </div>

      <div className="page-section" style={{ textAlign: 'center' }}>
        <a className="btn-secondary" href="https://github.com/omniswitch-dev/omniswitch/blob/main/BENCHMARKS.md" target="_blank" rel="noreferrer">
          Read BENCHMARKS.md
        </a>
      </div>
    </div>
  );
}
