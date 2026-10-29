import PageShell, { PageSection } from '../components/PageShell.jsx'
import { CodePanel, TextLink } from '../components/UI.jsx'
import { installCommand, productDoc } from '../data/product.js'
import release from '../data/release.json'

const configuration = `apiVersion: omniswitch.dev/v1
kind: GatewayConfig
gateway:
  listen: "127.0.0.1:8080"
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
  return (
    <PageShell
      eyebrow="GET STARTED"
      title="Quickstart"
      lede="Run OmniSwitch locally and send your first model request."
    >
      <PageSection id="install" title="1. Build the gateway">
        <p>
          This guide uses a pinned development source. You need Git, Go{' '}
          {release.prerelease.go_version} or newer, and a provider API key.
        </p>
        <CodePanel title="Build OmniSwitch" language="Shell" code={installCommand()} />
        <TextLink href={productDoc('docs/DEPLOYMENT.md')}>Docker & Kubernetes deployment</TextLink>
      </PageSection>
      <PageSection id="run" title="2. Configure and start">
        <p>
          Save this as <code>omniswitch.yaml</code>. The gateway listens on your machine only, with
          authentication enabled.
        </p>
        <CodePanel title="omniswitch.yaml" language="YAML" code={configuration} />
        <CodePanel
          title="Start the gateway"
          language="Shell"
          code={`export OPENAI_API_KEY="your-provider-key"\nexport OMNISWITCH_BOOTSTRAP_API_KEY="$(openssl rand -hex 32)"\nexport OMNISWITCH_KEY="$OMNISWITCH_BOOTSTRAP_API_KEY"\nOMNISWITCH_CONFIG=omniswitch.yaml ./omniswitch serve`}
        />
        <p>
          Keep this terminal running. In a second terminal, set <code>OMNISWITCH_KEY</code> to the
          same gateway key. Keep both keys private.
        </p>
      </PageSection>
      <PageSection id="request" title="3. Send a request">
        <CodePanel
          title="Install the client"
          language="Shell"
          code="python -m pip install openai"
        />
        <CodePanel title="Make a model request" language="Python" code={client} />
        <p>
          Open <code>http://localhost:8080/</code> for the dashboard. Use named gateway keys for
          applications after the initial setup.
        </p>
        <div className="guide-actions">
          <TextLink href="/docs">Configuration guides</TextLink>
          <TextLink href="/api">API reference</TextLink>
        </div>
      </PageSection>
    </PageShell>
  )
}
