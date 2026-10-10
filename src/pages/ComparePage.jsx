import PageShell, { PageSection, NextSteps } from '../components/PageShell.jsx'
import { Card, CodePanel, TextLink } from '../components/UI.jsx'
import Matrix, { Legend, MatrixScope } from '../components/Matrix.jsx'
import SourceList, { Methodology } from '../components/SourceList.jsx'
import { MarketContext } from './Compare.jsx'
import {
  claims,
  competitors,
  capabilityGroups,
  latestReview,
  hubColumns,
  migrationEnabled,
} from '../data/comparison.js'

const headers = [
  'x-omniswitch-provider',
  'x-omniswitch-config',
  'x-omniswitch-trace-id',
  'x-omniswitch-session-id',
  'x-omniswitch-shadow-provider',
]
const python = `import os
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key=os.environ["OMNISWITCH_KEY"],
)
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello"}],
)
print(response.choices[0].message.content)`
const node = `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://localhost:8080/v1",
  apiKey: process.env.OMNISWITCH_KEY,
});
const response = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "Hello" }],
});
console.log(response.choices[0].message.content);`

export default function ComparePage({ slug }) {
  const competitor = competitors.find((c) => c.slug === slug)
  const columns = [
    hubColumns[0],
    hubColumns.find((c) => c.id === competitor.primary),
    ...competitor.editions.map((e) => ({
      id: e.id,
      name: e.label,
      note: 'Separate registered edition',
    })),
  ]
  const groups = capabilityGroups()
  const rows = groups.flatMap((g) => g.capabilities)
  const reviewed = latestReview(
    rows,
    columns.map((c) => c.id),
  )
  const migration = migrationEnabled(competitor)
  return (
    <div className="competitor-page">
      <PageShell
        eyebrow="Architecture before checklists"
        title={`OmniSwitch vs ${competitor.name}`}
        lede={`Compare a secure self-hosted control plane, AI gateway routing, and agent protocol scope with ${competitor.name}. Evaluate the operating model before the feature list.`}
        updated={reviewed}
        breadcrumbs={[{ label: 'Compare', href: '/compare' }, { label: competitor.name }]}
      >
        <p className="edition-note">
          {competitor.column_note}. Register {claims.source.commit.slice(0, 7)}; each cell records
          its own version and verified date. A capability review, not a benchmark.
        </p>
        <PageSection id="fit" title="At a glance">
          <div className="at-a-glance">
            <Card>
              <h3>Choose OmniSwitch when…</h3>
              <ul>
                {competitor.choose_omniswitch.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3>Choose {competitor.name} when…</h3>
              <ul>
                {competitor.choose_them.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          </div>
          <p>
            No scores or totals: uneven documentation coverage is not a measure of product quality.
          </p>
        </PageSection>
        <PageSection id="capabilities" title="The full capability comparison">
          <Legend rows={rows} columns={columns} />
          <div className="competitor-table">
            <Matrix groups={groups} columns={columns} />
          </div>
          <MatrixScope gatewayIds={columns.map((c) => c.id)} />
        </PageSection>
        {migration ? (
          <PageSection id="migration" title={`A starting point from ${competitor.name}`}>
            <p>
              The register verifies OpenAI-compatible chat on both sides. This guide is limited to
              an OpenAI SDK base-URL change for chat; it does not establish compatibility for other
              APIs or headers.
            </p>
            <ol>
              {competitor.migration.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <p>
              Create an OmniSwitch gateway API key. The SDK sends it as{' '}
              <code>Authorization: Bearer &lt;OmniSwitch key&gt;</code>. Provider credentials stay
              in the gateway; do not reuse your competitor platform key.
            </p>
            <CodePanel title="Pilot with the OpenAI Python SDK" language="Python" code={python} />
            <CodePanel title="Pilot with the OpenAI Node SDK" language="JavaScript" code={node} />
            <h3>Map headers explicitly</h3>
            <ul className="header-map">
              {headers.map((header) => (
                <li key={header}>
                  <code>{header}</code>
                  <span>Map your {competitor.name} equivalent here.</span>
                </li>
              ))}
            </ul>
            <p>
              Chat selects its model with the JSON <code>model</code> field. The{' '}
              <code>x-omniswitch-model</code> header is an A2A selector, not a chat model override.
            </p>
            <p>
              Read{' '}
              <a href={competitor.migration.headers_url}>
                {competitor.name}’s header documentation
              </a>{' '}
              and the <a href="/api#headers">OmniSwitch header reference</a>. Custom header
              conventions, automatic configuration import, gateway-key import, and direct Anthropic
              SDK header support are not implied.
            </p>
            <p>
              Pilot representative blocking and streaming calls, tools, errors, retries, metadata,
              and observability. Keep the original gateway available until your app-level tests
              pass.
            </p>
          </PageSection>
        ) : (
          <PageSection id="side-by-side" title="Running side by side">
            <p>
              {competitor.name} has a different platform or proxy operating model. Start a separate
              OmniSwitch deployment, define a representative route, and compare request behavior and
              operational fit. No base-URL migration guide is offered without verified compatibility
              on both sides.
            </p>
            <TextLink href="/quickstart">Start a local evaluation</TextLink>
          </PageSection>
        )}
        {!!competitor.context.length && (
          <PageSection id="context" title="Dated market context">
            <MarketContext items={competitor.context} />
          </PageSection>
        )}
        <PageSection id="sources" title="Sources & methodology">
          <SourceList columns={columns} competitors={[competitor]} rows={rows} />
          <Methodology />
        </PageSection>
        <div className="next-steps">
          <TextLink href="/compare">All six comparisons</TextLink>
          <TextLink href="/security">Security boundaries</TextLink>
        </div>
        <NextSteps />
      </PageShell>
    </div>
  )
}
