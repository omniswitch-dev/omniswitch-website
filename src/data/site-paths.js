import redirects from './redirects.json' with { type: 'json' }

export function redirectTarget(href) {
  const url = new URL(href, 'https://omniswitch.dev')
  if (url.origin !== 'https://omniswitch.dev') return null
  const destination = redirects[url.pathname.replace(/\/+$/, '') || '/']
  if (!destination) return null
  const target = new URL(destination, url.origin)
  return target.pathname + url.search + (target.hash || url.hash)
}
