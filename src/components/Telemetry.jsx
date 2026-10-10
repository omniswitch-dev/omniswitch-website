import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

export default function Telemetry() {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    setEnabled(
      import.meta.env.PROD &&
        ['omniswitch.dev', 'www.omniswitch.dev'].includes(window.location.hostname),
    )
  }, [])
  return enabled ? (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  ) : null
}
