import PageShell from '../components/PageShell.jsx'
import { Button } from '../components/UI.jsx'
export default function NotFound() {
  return (
    <div className="not-found">
      <PageShell
        eyebrow="404"
        title="Page not found"
        lede="This page may have moved. Return to OmniSwitch or open the documentation to find what you need."
      >
        <div className="guide-actions">
          <Button href="/" variant="primary" arrow>
            Back to home
          </Button>
          <Button href="/docs">Documentation</Button>
        </div>
      </PageShell>
    </div>
  )
}
