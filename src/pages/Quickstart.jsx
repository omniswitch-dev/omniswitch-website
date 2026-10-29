import PageShell, { PageSection, NextSteps } from '../components/PageShell.jsx'
import { CodePanel, TextLink } from '../components/UI.jsx'
import { ReleaseNotice, KnownLimitations } from '../components/ReleaseNotice.jsx'
import release from '../data/release.json'
import { installCommand } from '../data/product.js'

const configuration = `apiVersion: omniswitch.dev/v1
kind: GatewayConfig
gateway:
  listen: ":8080"
  auth: true
  cache_scope: api_key
  log_payloads: false
providers:
  - name: openai
    type: openai
    api_key_env: OPENAI_API_KEY`
const client = `import os
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

export default function Quickstart() {
  const run = release.published ? release.commands.run.replace(/^\.\//, '') : release.commands.run
  return (
    <PageShell
      eyebrow="Start with self-hosted control"
      title="Quickstart"
      lede="Run the control plane locally, connect an OpenAI-compatible client, then explore governed tool and agent traffic."
      updated={release.updated}
    >
      <ReleaseNotice />
      <PageSection id="install" title="01 / Install the gateway">
        <p>
          {release.published
            ? `Install ${release.tag} from the published release.`
            : `You need Git and Go ${release.prerelease.go_version} or newer to build the pinned evaluation source. No beta tag or download is assumed.`}{' '}
          You also need a provider account or a local model endpoint.
        </p>
        <CodePanel
          title={release.published ? 'Install OmniSwitch' : 'Build the pinned evaluation source'}
          language="Shell"
          code={installCommand()}
        />
        <TextLink href="/install">All install options</TextLink>
      </PageSection>
      <PageSection id="run" title="02 / Set the boundaries, then run">
        <p>
          Create <code>omniswitch.yaml</code> with authentication on, API-key-scoped caching, and
          payload logging off. The example uses OpenAI; choose your own provider.
        </p>
        <CodePanel title="Minimal gateway configuration" language="YAML" code={configuration} />
        <p>
          Keep provider credentials separate from gateway client keys. Generate a local bootstrap
          key, and keep it out of git and shared logs.
        </p>
        <CodePanel
          title="Start with authentication enabled"
          language="Shell"
          code={`export OPENAI_API_KEY="your-provider-key"\nexport OMNISWITCH_AUTH=true\nexport OMNISWITCH_BOOTSTRAP_API_KEY="$(openssl rand -hex 32)"\nexport OMNISWITCH_BOOTSTRAP_ROLE=admin\nexport OMNISWITCH_KEY="$OMNISWITCH_BOOTSTRAP_API_KEY"\n${run}`}
          footer="Use a personal admin key after bootstrap; remove the bootstrap key from the server environment."
        />
        <p>
          The foreground server runs on port 8080. Open a second terminal for the client and supply
          the same gateway key as <code>OMNISWITCH_KEY</code>; do not substitute your provider key.
        </p>
      </PageSection>
      <PageSection id="request" title="03 / Make one request">
        <CodePanel
          title="Install the OpenAI client"
          language="Shell"
          code={release.commands.python_install}
        />
        <CodePanel title="Send a governed chat request" language="Python" code={client} />
        <p>
          The SDK sends the gateway key as a Bearer token. Routing, local checks, budgets, and
          request logs stay in the gateway. Responses and Messages APIs have a separate documented
          scope.
        </p>
      </PageSection>
      <PageSection id="verify" title="Verify reachability and readiness">
        <CodePanel
          title="Check the gateway probes"
          language="Shell"
          code={release.commands.health}
        />
        <p>
          <code>/healthz</code> checks reachability; <code>/readyz</code> checks readiness. A
          healthy process alone does not prove provider connectivity—verify a representative model
          call too.
        </p>
      </PageSection>
      <KnownLimitations />
      <NextSteps />
    </PageShell>
  )
}
