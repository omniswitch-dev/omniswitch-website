import PageShell from '../components/PageShell.jsx'
import { Button } from '../components/UI.jsx'

export default function NotFound() {
  return (
    <div className="not-found">
      <PageShell
        eyebrow="404 / Route not found"
        title="This path is outside the gateway."
        lede="The page may have moved. Start with the self-hosted product overview, compare gateway architectures, or find the current documentation."
      >
        <Button href="/" variant="primary" arrow>
          Back to OmniSwitch
        </Button>
        <div className="next-steps">
          <Button href="/compare">Compare gateways</Button>
          <Button href="/docs">Read the docs</Button>
        </div>
      </PageShell>
    </div>
  )
}
