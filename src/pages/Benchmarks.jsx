import PageShell, { PageSection, NextSteps } from '../components/PageShell.jsx'
import { CodePanel, Pill, TextLink } from '../components/UI.jsx'
import benchmarks from '../data/benchmarks.json'
import { productDoc } from '../data/product.js'

export default function Benchmarks() {
  return (
    <PageShell
      eyebrow="Proof before performance claims"
      title="Benchmarks"
      lede="Evaluate the self-hosted gateway with reproducible workloads. Cross-gateway results remain pending; protocol coverage and operating model are separate questions."
      updated={benchmarks.updated}
    >
      <PageSection id="status" title="Cross-gateway results are pending">
        <div className="benchmark-status">
          <Pill>Pending</Pill>
          <span>No published measurement campaign</span>
        </div>
        <p>{benchmarks.run.harness}</p>
        <p>
          There is no competitor latency table, throughput ranking, or promised run date. Results
          need a pinned run manifest, reproducible configurations, and raw artifacts.
        </p>
        <TextLink href={productDoc('BENCHMARKS.md')}>Published baseline and methodology</TextLink>
      </PageSection>
      <PageSection
        id="methodology"
        title={`Frozen methodology / ${benchmarks.methodology_version}`}
      >
        <p>
          Methodology frozen {benchmarks.methodology_frozen}. Review the harness’s canonical
          protocol before comparing a self-hosted process with a managed network service.
        </p>
        <div className="content-grid">
          {benchmarks.methodology.map((group) => (
            <article className="card" key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </PageSection>
      <PageSection id="scenarios" title="What the campaign will measure">
        <ol>
          {benchmarks.scenarios.map((scenario) => (
            <li key={scenario.n}>
              <strong>{scenario.title}.</strong> {scenario.desc} Metrics: {scenario.metric}.
            </li>
          ))}
        </ol>
      </PageSection>
      <PageSection id="microbenchmarks" title="Published guardrail microbenchmarks">
        <div data-benchmark-evidence="published">
          <p>{benchmarks.measured.title}</p>
          <p>
            <strong>Environment:</strong> {benchmarks.measured.environment}. These are published
            component measurements, not cross-gateway results and not measurements from this website
            session.
          </p>
          <div className="table-scroll">
            <table className="data-table">
              <caption>Existing BENCHMARKS.md component results</caption>
              <thead>
                <tr>
                  <th scope="col">Payload</th>
                  <th scope="col">Go path</th>
                  <th scope="col">Rust-WASM path</th>
                  <th scope="col">Reported ratio</th>
                </tr>
              </thead>
              <tbody>
                {benchmarks.measured.rows.map((row) => (
                  <tr key={row.payload}>
                    <th scope="row">{row.payload}</th>
                    <td>{row.go}</td>
                    <td>{row.wasm}</td>
                    <td>{row.speedup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TextLink href={productDoc('BENCHMARKS.md')}>Published source and environment</TextLink>
        </div>
        <p>
          A component microbenchmark does not establish end-to-end overhead, time to first token, or
          production throughput. Re-run on your own hardware.
        </p>
        <CodePanel
          title="Reproduce the component benchmarks"
          language="Shell"
          code={benchmarks.reproduce.commands.join('\n')}
        />
      </PageSection>
      <PageSection id="caveats" title="Read the caveats first">
        <ul>
          {benchmarks.caveats.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3>What we do not infer</h3>
        <ul>
          {benchmarks.not_claimed.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </PageSection>
      <NextSteps />
    </PageShell>
  )
}
