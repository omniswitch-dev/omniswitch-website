import PageShell, { PageSection, NextSteps } from '../components/PageShell.jsx'
import { TextLink, Pill } from '../components/UI.jsx'
import { KnownLimitations } from '../components/ReleaseNotice.jsx'
import { productDoc, A2A_SCOPE } from '../data/product.js'
import release from '../data/release.json'

const sections = [
  [
    'configuration',
    'Configuration & hot reload',
    <>
      Use <code>GatewayConfig</code> with <code>gateway.auth</code>,{' '}
      <code>gateway.cache_scope</code>, and <code>gateway.log_payloads</code>. File-driven routes
      and supported policy settings hot-reload; process and storage settings can require a restart.
    </>,
    'docs/CONFIGURATION.md',
  ],
  [
    'authentication',
    'Authentication & gateway keys',
    <>
      Enable <code>OMNISWITCH_AUTH=true</code>. Use <code>OMNISWITCH_BOOTSTRAP_API_KEY</code> for
      first-run access, then create a personal gateway API key. Roles and workspace scope govern
      access. OIDC workload identity is separate from dashboard SSO.
    </>,
    'docs/CONFIGURATION.md',
  ],
  [
    'routing',
    'Routing & providers',
    <>
      Configure the <code>providers[]</code> list and the <code>routes</code> map of named routes.
      Native adapters and custom OpenAI-compatible endpoints share fallback, retry, timeout,
      weighted routing, and CEL condition controls.
    </>,
    'docs/CONFIGURATION.md',
  ],
  [
    'guardrails',
    'Local guardrails',
    <>
      Configure <code>guardrails.actions</code>, <code>guardrails.rules[]</code>, and opt-in
      webhooks. Deny and redact are enforcement actions; checks are not a guarantee against every
      attack. Output stream buffering can delay delivery.
    </>,
    'docs/CONFIGURATION.md',
  ],
  [
    'limits',
    'Budgets & limits',
    <>
      Gateway API keys have budgets; <code>rate_limit.requests</code> and{' '}
      <code>rate_limit.window</code> control request windows. Optional{' '}
      <code>rate_limit.redis_url</code> shares windows across replicas. Token/USD policies and
      per-key TPM/USD-day limits are part of the{' '}
      {release.published ? 'v0.2.0 release' : 'unreleased v0.2.0 work'}.
    </>,
    'docs/CONFIGURATION.md',
  ],
  [
    'vault',
    'Provider credentials',
    <>
      Provider credentials are upstream secrets, not gateway API keys. Reference secrets through{' '}
      <code>providers[].api_key_env</code>. Never embed a production credential in checked-in YAML,
      examples, traces, or screenshots.
    </>,
    'docs/CONFIGURATION.md',
  ],
  [
    'mcp',
    'MCP tool governance',
    <>
      MCP is Beta. Configure <code>mcp.enabled</code> and <code>mcp.targets[]</code> for HTTP/SSE or
      persistent stdio targets. Federation and policy-gated calls are available. Per-tool discovery
      filtering and configurable RFC 8693 token exchange are{' '}
      {release.published ? 'part of v0.2.0' : 'prepared for v0.2.0'}; OAuth protected-resource
      discovery is deferred.
    </>,
    'internal/proxy/handler.go',
  ],
  [
    'a2a',
    'Governed A2A model access',
    <>
      {A2A_SCOPE} This interface uses the governed model pipeline; it is not a durable orchestration
      service.
    </>,
    'internal/gateway/a2a.go',
  ],
  [
    'observability',
    'Observability',
    <>
      Inspect request metadata and guardrail events in the gateway. Configure{' '}
      <code>observability.prometheus_enabled</code> and OTLP settings for your own monitoring stack.
      Payload logging stays an explicit opt-in. The redesigned operator console is part of the{' '}
      {release.published ? 'v0.2.0 release' : 'unreleased release work'}.
    </>,
    'docs/OBSERVABILITY.md',
  ],
  [
    'deployment',
    'Deployment',
    <>
      Start with a binary or container. Use one replica with SQLite. Multi-replica v0.2.0
      deployments require Postgres; Redis shares rate-limit windows. Configure authentication, TLS
      termination, backups, and retention before exposing a gateway.
    </>,
    'docs/DEPLOYMENT.md',
  ],
]

export default function Docs() {
  return (
    <PageShell
      eyebrow="Operate the control layer"
      title="Understand what you run."
      lede="Start with security and deployment, connect providers through the gateway, then add policy-aware tool and agent traffic."
      toc={[['quickstart', 'Quickstart'], ...sections.map(([id, title]) => [id, title])]}
    >
      <PageSection id="quickstart" title="Start with one governed request">
        <p>
          The quickstart creates an auth-enabled local gateway and an OpenAI-compatible client.
          Until the release is published, it uses a pinned source build rather than a nonexistent
          download.
        </p>
        <NextSteps />
      </PageSection>
      {sections.map(([id, title, body, source]) => (
        <PageSection key={id} id={id} title={title}>
          {['mcp', 'a2a'].includes(id) && <Pill />}
          <p>{body}</p>
          <TextLink href={productDoc(source)}>
            Read the canonical {id === 'a2a' || id === 'mcp' ? 'implementation' : 'guide'}
          </TextLink>
        </PageSection>
      ))}
      <KnownLimitations />
    </PageShell>
  )
}
