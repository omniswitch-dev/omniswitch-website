import PageShell, { PageSection, NextSteps } from '../components/PageShell.jsx'
import { CodePanel, Pill, TextLink } from '../components/UI.jsx'
import { A2A_SCOPE, productDoc } from '../data/product.js'
import release from '../data/release.json'

const endpoints = [
  [
    'POST',
    '/v1/chat/completions',
    'OpenAI-compatible chat, blocking and streaming, with provider-specific parameter handling. Unsupported translated parameters return a clear error; validate your selected adapter.',
  ],
  [
    'POST',
    '/v1/embeddings',
    'OpenAI-compatible embeddings through providers that implement the endpoint. Input checks and provider fallback scope apply.',
  ],
  [
    'POST',
    '/v1/rerank',
    'Rerank requests through providers that implement reranking. This is a documented request shape, not a blanket OpenAI API claim.',
  ],
  [
    'POST',
    '/v1/responses',
    `A documented Responses subset. Tool-capable streaming translation is ${release.published ? 'included in v0.2.0' : 'part of the unreleased v0.2.0 work'}; no stateful previous_response_id support.`,
  ],
  [
    'POST',
    '/v1/messages',
    `A documented Messages subset. Tool-use and streaming translation are ${release.published ? 'included in v0.2.0' : 'part of the unreleased v0.2.0 work'}. Do not assume direct Anthropic SDK header compatibility.`,
  ],
  [
    'GET',
    '/v1/models',
    'Models registered by provider adapters and catalog aliases. Available models depend on your provider configuration.',
  ],
]
const headers = [
  ['Authorization', 'Bearer gateway API key when auth is enabled'],
  ['x-omniswitch-provider', 'Force a configured provider or alias'],
  ['x-omniswitch-config', 'Select a saved gateway config by name or ID'],
  ['x-omniswitch-model', 'Set the model for A2A messages; chat uses the JSON model field'],
  ['x-omniswitch-shadow-provider', 'Run a configured secondary provider asynchronously'],
  ['x-omniswitch-trace-id', 'Group calls into a request trace'],
  ['x-omniswitch-session-id', 'Group calls into an agent session'],
  ['x-omniswitch-workspace-id', 'Workspace context (subject to key scope)'],
  ['x-omniswitch-organization-id', 'Organization context (subject to key scope)'],
  ['x-omniswitch-tags', 'Request tags'],
  ['x-omniswitch-metadata', 'Request metadata'],
  ['x-omniswitch-user-id', 'Caller-supplied user context'],
]

export default function ApiReference() {
  return (
    <PageShell
      eyebrow="One governed request path"
      title="An API you can inspect."
      lede="Authenticate at the self-hosted control plane, route model requests through a shared gateway, and evaluate the explicit MCP and A2A beta scope."
    >
      <PageSection id="authentication" title="Authenticate before inference">
        <p>
          Send a gateway client key as <code>Authorization: Bearer &lt;OmniSwitch key&gt;</code>.
          Provider credentials remain upstream secrets. Local development uses{' '}
          <code>http://localhost:8080/v1</code>; terminate TLS before exposing a deployment.
        </p>
        <CodePanel
          title="A minimal chat request"
          language="Shell"
          code={`curl http://localhost:8080/v1/chat/completions \\\n  -H "Authorization: Bearer $OMNISWITCH_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}'`}
        />
      </PageSection>
      <PageSection id="models" title="Model endpoints">
        {endpoints.map(([method, path, detail]) => (
          <article className="endpoint" key={path}>
            <h3>
              <Pill variant="stable">{method}</Pill>
              <code>{path}</code>
            </h3>
            <p>{detail}</p>
          </article>
        ))}
        <p>
          OpenAI image generation, multipart audio transcription, and audio speech are{' '}
          {release.published
            ? 'available in v0.2.0 with the OpenAI provider'
            : 'planned for the v0.2.0 release with the OpenAI provider'}
          . Other providers are not implied to support them.
        </p>
        <TextLink href={productDoc('docs/API.md')}>Read endpoint and parameter scope</TextLink>
      </PageSection>
      <PageSection id="agents" title="MCP & A2A">
        <article className="endpoint">
          <h3>
            <code>/mcp</code>
            <Pill />
          </h3>
          <p>
            HTTP-facing tool discovery and calls across configured HTTP/SSE and stdio targets,
            subject to gateway policy. MCP is off by default in the release-foundation evaluation
            path.
          </p>
        </article>
        <article className="endpoint">
          <h3>
            <code>/.well-known/agent-card.json</code>
            <Pill />
          </h3>
          <p>
            Public Agent Card discovery; model access is authenticated at <code>/a2a</code>.
          </p>
          <p>{A2A_SCOPE}</p>
          <TextLink href={productDoc('internal/gateway/a2a.go')}>
            Inspect the A2A implementation
          </TextLink>
        </article>
      </PageSection>
      <PageSection id="headers" title="Gateway headers">
        <div className="table-scroll">
          <table className="data-table">
            <caption>OmniSwitch request headers</caption>
            <thead>
              <tr>
                <th scope="col">Header</th>
                <th scope="col">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {headers.map(([name, purpose]) => (
                <tr key={name}>
                  <th scope="row">
                    <code>{name}</code>
                  </th>
                  <td>{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          These are OmniSwitch headers, not aliases for competitor header conventions. Responses
          report <code>x-omniswitch-cache: HIT</code> or <code>MISS</code>. Cache isolation is
          configured with <code>gateway.cache_scope</code>, not a request header. Per-key scope is
          the safer default; global caching is appropriate only for tenant-independent public
          prompts.
        </p>
        <TextLink href={productDoc('internal/gateway/gateway.go')}>
          Inspect header handling
        </TextLink>
      </PageSection>
      <PageSection id="operations" title="Health & telemetry">
        <div className="table-scroll">
          <table className="data-table">
            <caption>Operational endpoint scope</caption>
            <thead>
              <tr>
                <th scope="col">Endpoint</th>
                <th scope="col">Scope</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  <code>/healthz</code>
                </th>
                <td>Public process health probe</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>/readyz</code>
                </th>
                <td>Public readiness probe</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>/metrics</code>
                </th>
                <td>Prometheus; authenticated unless explicitly configured public</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>/api/*</code>
                </th>
                <td>
                  Management routes are authenticated and role-scoped, except documented public
                  health checks
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Output guardrail buffering can delay SSE delivery until the full response has been
          scanned. Benchmark results remain pending; no latency promise is made.
        </p>
      </PageSection>
      <NextSteps />
    </PageShell>
  )
}
