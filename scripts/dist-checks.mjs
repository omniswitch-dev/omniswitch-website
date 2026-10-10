import { attributes, decodeHtml, metaMap, visibleText } from './html.mjs'

export function bannedHits(html, rules) {
  const metadata =
    [...metaMap(html).values()].join(' ') +
    ' ' +
    decodeHtml(html.match(/<title>(.*?)<\/title>/s)?.[1] || '')
  const full = visibleText(html) + ' ' + metadata
  const withoutBenchmarks = visibleText(html, { excludeBenchmark: true }) + ' ' + metadata
  const marketing =
    visibleText(html, { excludeEvidence: true, excludeBenchmark: true }) + ' ' + metadata
  return rules
    .filter((rule) =>
      new RegExp(rule.pattern, 'i').test(
        rule.marketing_only ? marketing : rule.benchmark_only_exception ? withoutBenchmarks : full,
      ),
    )
    .map((rule) => rule.label)
}

export function validatePage(html, route, rules) {
  function require(value, message) {
    if (!value) throw new Error(`${route.path}: ${message}`)
  }
  const titles = [...html.matchAll(/<title>(.*?)<\/title>/gs)]
  require(titles.length === 1, 'expected one title')
  const title = decodeHtml(titles[0][1])
  require(title === route.title, 'title does not match route')
  require((html.match(/<h1(?:\s|>)/g) || []).length === 1, 'expected one h1')
  const meta = metaMap(html)
  const description = meta.get('description')
  require(description === route.description &&
    description.length >= 70 &&
    description.length <= 160, 'description must match the route and contain 70–160 characters')
  const canonicals = [...html.matchAll(/<link\b[^>]*>/g)]
    .map(([tag]) => attributes(tag))
    .filter((tag) => tag.rel === 'canonical')
  require(canonicals.length === 1 &&
    canonicals[0].href === `https://omniswitch.dev${route.path}`, 'invalid canonical')
  for (const [key, expected] of [
    ['og:title', route.title],
    ['og:description', route.description],
    ['og:url', canonicals[0].href],
    ['og:image', `https://omniswitch.dev${route.ogImage}`],
    ['og:image:width', '1200'],
    ['og:image:height', '630'],
    ['twitter:card', 'summary_large_image'],
    ['twitter:title', route.title],
    ['twitter:description', route.description],
    ['twitter:image', `https://omniswitch.dev${route.ogImage}`],
  ])
    require(meta.get(key) === expected, `invalid ${key}`)
  const blocks = [
    ...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs),
  ]
  require(blocks.length === 1, 'expected one JSON-LD block')
  const structured = JSON.parse(blocks[0][1])
  require(Array.isArray(structured), 'JSON-LD must be an array')
  const types = structured.map((entry) => entry['@type'])
  require(types.includes(
    route.path === '/' ? 'SoftwareApplication' : 'BreadcrumbList',
  ), 'missing required JSON-LD type')
  if (route.path !== '/')
    require(types.includes('WebPage') &&
      structured.find((s) => s['@type'] === 'WebPage').dateModified ===
        route.updated, 'missing dated WebPage')
  require(!/SearchAction|AggregateRating|FAQPage/.test(blocks[0][1]), 'unsupported structured data')
  require(visibleText(html).length >= 600, 'body is an empty or incomplete shell')
  require(!/fonts\.googleapis\.com|fonts\.gstatic\.com|dashboard-mockup\.png/.test(
    html,
  ), 'removed resource reference')
  const hits = bannedHits(html, rules)
  require(hits.length === 0, `banned phrases: ${hits.join(', ')}`)
  return {
    title,
    description,
    canonical: canonicals[0].href,
    ogImage: meta.get('og:image'),
    structured: JSON.stringify(structured),
  }
}
