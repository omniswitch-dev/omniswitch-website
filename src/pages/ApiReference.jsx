import PageShell, { PageSection } from '../components/PageShell.jsx'
import { CodePanel, TextLink } from '../components/UI.jsx'
import { productDoc } from '../data/product.js'

const endpoints = [
  ['POST', '/v1/chat/completions', 'Chat completions and streaming'],
  ['POST', '/v1/responses', 'Documented OpenAI Responses subset'],
  ['POST', '/v1/messages', 'Documented Anthropic Messages subset'],
  ['POST', '/v1/embeddings', 'Embeddings from supported providers'],
  ['POST', '/v1/rerank', 'Reranking from supported providers'],
  ['POST', '/v1/moderations', 'Local moderation checks'],
  ['GET', '/v1/models', 'Configured models and aliases'],
]
export default function ApiReference() {
  return (
    <PageShell
      eyebrow="DEVELOPERS"
      title="API reference"
      lede="One gateway endpoint for model requests and configured tools."
    >
      <PageSection id="authentication" title="Authentication">
        <p>
          When authentication is enabled, send your gateway key in the <code>Authorization</code>{' '}
          header. Provider credentials stay in the gateway.
        </p>
        <CodePanel
          title="Chat request"
          language="Shell"
          code={`curl http://localhost:8080/v1/chat/completions \\\n  -H "Authorization: Bearer $OMNISWITCH_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}'`}
        />
      </PageSection>
      <PageSection id="models" title="Model endpoints">
        <div className="table-scroll">
          <table className="data-table endpoint-table">
            <caption>Model API endpoints</caption>
            <thead>
              <tr>
                <th scope="col">Method</th>
                <th scope="col">Endpoint</th>
                <th scope="col">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map(([method, path, description]) => (
                <tr key={path}>
                  <td>{method}</td>
                  <th scope="row">
                    <code>{path}</code>
                  </th>
                  <td>{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Supported parameters depend on the provider and endpoint. Check the complete reference for
          request shapes and compatibility.
        </p>
        <TextLink href={productDoc('docs/API.md')}>Full API reference</TextLink>
      </PageSection>
      <PageSection id="agents" title="MCP & agent discovery">
        <p>
          Use <code>/mcp</code> for configured MCP targets and policy-gated tool calls. The public
          Agent Card is available at <code>/.well-known/agent-card.json</code>; authenticated agent
          messages use <code>/a2a</code>.
        </p>
        <TextLink href={productDoc('docs/API.md')}>Protocol configuration & scope</TextLink>
      </PageSection>
      <PageSection id="operations" title="Operations">
        <p>
          <code>/healthz</code> checks process health, <code>/readyz</code> checks readiness, and{' '}
          <code>/metrics</code> exposes configured Prometheus metrics.
        </p>
        <TextLink href={productDoc('docs/OBSERVABILITY.md')}>Observability guide</TextLink>
      </PageSection>
    </PageShell>
  )
}
