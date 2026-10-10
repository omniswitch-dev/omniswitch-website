import release from './data/release.json' with { type: 'json' }

export const origin = 'https://omniswitch.dev'
export const canonicalUrl = (path) => origin + path
const software = {
  '@type': 'SoftwareApplication',
  name: 'OmniSwitch',
  url: origin,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Linux, macOS, Windows',
}

export function jsonLd(route) {
  if (route.path === '/')
    return [
      {
        '@context': 'https://schema.org',
        ...software,
        softwareVersion: release.published ? release.version : `${release.version}-pre-release`,
        description: route.description,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        license: 'https://www.apache.org/licenses/LICENSE-2.0',
        downloadUrl: release.published
          ? `https://github.com/${release.repo}/releases/tag/${release.tag}`
          : `https://github.com/${release.prerelease.repo}/tree/${release.prerelease.commit}`,
        author: { '@type': 'Organization', name: 'OmniSwitch', url: origin },
      },
    ]
  const crumbs = [{ '@type': 'ListItem', position: 1, name: 'OmniSwitch', item: `${origin}/` }]
  if (route.path.startsWith('/compare/'))
    crumbs.push({ '@type': 'ListItem', position: 2, name: 'Compare', item: `${origin}/compare` })
  crumbs.push({
    '@type': 'ListItem',
    position: crumbs.length + 1,
    name: route.label,
    item: canonicalUrl(route.path),
  })
  return [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: route.title,
      description: route.description,
      url: canonicalUrl(route.path),
      dateModified: route.updated,
      about: software,
    },
  ]
}

export function metadata(route) {
  return {
    title: route.title,
    canonical: canonicalUrl(route.path),
    meta: [
      ['name', 'description', route.description],
      ['name', 'robots', route.robots || 'index,follow'],
      ['name', 'theme-color', '#06060a'],
      ['property', 'og:type', route.path === '/' ? 'website' : 'article'],
      ['property', 'og:title', route.title],
      ['property', 'og:description', route.description],
      ['property', 'og:url', canonicalUrl(route.path)],
      ['property', 'og:image', origin + route.ogImage],
      ['property', 'og:image:width', '1200'],
      ['property', 'og:image:height', '630'],
      ['property', 'og:image:alt', `${route.label} — OmniSwitch self-hosted AI control`],
      ['property', 'og:site_name', 'OmniSwitch'],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', route.title],
      ['name', 'twitter:description', route.description],
      ['name', 'twitter:image', origin + route.ogImage],
    ],
    jsonLd: jsonLd(route),
  }
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function renderHead(route) {
  const head = metadata(route)
  const structured = JSON.stringify(head.jsonLd).replaceAll('<', '\\u003c')
  return (
    `<title>${escapeHtml(head.title)}</title>\n` +
    head.meta
      .map(
        ([attribute, key, value]) => `<meta ${attribute}="${key}" content="${escapeHtml(value)}">`,
      )
      .join('\n') +
    `\n<link rel="canonical" href="${head.canonical}">\n<script id="route-jsonld" type="application/ld+json">${structured}</script>`
  )
}

export function applyMeta(route) {
  const head = metadata(route)
  document.title = head.title
  for (const [attribute, key, value] of head.meta) {
    let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute(attribute, key)
      document.head.append(element)
    }
    element.setAttribute('content', value)
  }
  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.append(canonical)
  }
  canonical.href = head.canonical
  let structured = document.getElementById('route-jsonld')
  if (!structured) {
    structured = document.createElement('script')
    structured.id = 'route-jsonld'
    structured.type = 'application/ld+json'
    document.head.append(structured)
  }
  structured.textContent = JSON.stringify(head.jsonLd)
}
