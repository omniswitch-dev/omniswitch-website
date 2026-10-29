import { execFileSync } from 'node:child_process'
import { readFile, readdir, stat } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'
import { validatePage } from './dist-checks.mjs'
import { attributes, internalLinks } from './html.mjs'
import redirects from '../src/data/redirects.json' with { type: 'json' }

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const manifest = JSON.parse(await readFile(resolve(dist, 'route-manifest.json'), 'utf8'))
const rules = JSON.parse(await readFile(resolve(root, 'scripts/banned-phrases.json'), 'utf8'))
const claims = JSON.parse(await readFile(resolve(root, 'src/data/claims.json'), 'utf8'))
const documents = new Map()
const uniqueness = Object.fromEntries(
  ['title', 'description', 'canonical', 'ogImage', 'structured'].map((key) => [key, new Set()]),
)
for (const route of manifest) {
  if (documents.has(route.path)) throw new Error(`Duplicate route: ${route.path}`)
  const html = await readFile(resolve(dist, route.output), 'utf8')
  const checked = validatePage(html, route, rules)
  for (const [tag] of html.matchAll(/<[\w-]+\b[^>]*data-benchmark-evidence=[^>]*>/g)) {
    const data = attributes(tag)
    if (data['data-benchmark-evidence'] === 'published') {
      if (
        route.path !== '/benchmarks' ||
        !html.includes('BENCHMARKS.md') ||
        !html.includes('Environment:')
      )
        throw new Error('Unsourced component benchmark exception')
    } else {
      const claim = claims.claims.find(
        (c) => c.gateway === data['data-gateway'] && c.capability === data['data-capability'],
      )
      if (
        data['data-benchmark-evidence'] !== 'cited-register' ||
        claim?.capability !== 'published-benchmarks' ||
        claim.status !== 'yes' ||
        !claim.source_url
      )
        throw new Error('Unsourced register benchmark exception')
    }
  }
  for (const [key, value] of Object.entries(checked)) {
    if (uniqueness[key].has(value)) throw new Error(`Duplicate ${key}: ${route.path}`)
    uniqueness[key].add(value)
  }
  const image = await readFile(resolve(dist, route.ogImage.slice(1)))
  if (
    image.toString('hex', 0, 8) !== '89504e470d0a1a0a' ||
    image.readUInt32BE(16) !== 1200 ||
    image.readUInt32BE(20) !== 630
  )
    throw new Error(`Invalid social image: ${route.ogImage}`)
  const ids = [...html.matchAll(/<[\w-]+\b[^>]*>/g)]
    .map(([tag]) => attributes(tag).id)
    .filter(Boolean)
  if (new Set(ids).size !== ids.length) throw new Error(`Duplicate HTML id: ${route.path}`)
  documents.set(route.path, { html, ids: new Set(ids), route })
}
if (
  documents.size !== 6 ||
  !['/', '/quickstart', '/docs', '/api', '/security', '/404'].every((path) => documents.has(path))
)
  throw new Error('Expected five public pages and a 404 page')
const hosting = JSON.parse(await readFile(resolve(root, 'vercel.json'), 'utf8'))
const configuredRedirects = Object.fromEntries(
  hosting.redirects.map((r) => [r.source, r.destination]),
)
if (JSON.stringify(configuredRedirects) !== JSON.stringify(redirects))
  throw new Error('Hosting redirects differ from the site map')
for (const [from, to] of Object.entries(redirects)) {
  const target = new URL(to, 'https://omniswitch.dev')
  const page = documents.get(target.pathname)
  if (!page || (target.hash && !page.ids.has(target.hash.slice(1))))
    throw new Error(`Broken redirect: ${from} → ${to}`)
  const fallback = await readFile(resolve(dist, from.slice(1), 'index.html'), 'utf8')
  if (!fallback.includes('noindex,follow') || !fallback.includes(`href="${to}"`))
    throw new Error(`Missing redirect fallback: ${from}`)
}
for (const [path, page] of documents) {
  for (const href of internalLinks(page.html)) {
    const url = new URL(href, `https://omniswitch.dev${path}`)
    const target = url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '')
    if (redirects[target])
      throw new Error(`Link should point to the current page: ${href} on ${path}`)
    const document = documents.get(target)
    if (document) {
      if (url.hash && !document.ids.has(decodeURIComponent(url.hash.slice(1))))
        throw new Error(`Missing anchor ${href} on ${path}`)
    } else {
      const candidate = resolve(dist, target.slice(1))
      if (!candidate.startsWith(dist + '/')) throw new Error(`Unsafe internal link: ${href}`)
      try {
        if (!(await stat(candidate)).isFile()) throw new Error('not a file')
      } catch {
        throw new Error(`Broken internal link ${href} on ${path}`)
      }
    }
  }
}
const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8')
for (const route of manifest.filter((r) => r.path !== '/404'))
  if (!sitemap.includes(`<loc>https://omniswitch.dev${route.path}</loc>`))
    throw new Error(`Missing sitemap route: ${route.path}`)
if (sitemap.includes('<loc>https://omniswitch.dev/404</loc>'))
  throw new Error('404 must not be indexed')
if (
  !(await readFile(resolve(dist, 'robots.txt'), 'utf8')).includes(
    'Sitemap: https://omniswitch.dev/sitemap.xml',
  )
)
  throw new Error('Missing robots sitemap')
try {
  await stat(resolve(dist, '.server'))
  throw new Error('SSR build was not removed')
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}
const assets = await readdir(resolve(dist, 'assets'))
let compressed = 0
for (const name of assets.filter((name) => name.endsWith('.js')))
  compressed += gzipSync(await readFile(resolve(dist, 'assets', name))).length
if (compressed >= 150000) throw new Error(`JavaScript exceeds 150 KB gzip: ${compressed} bytes`)
execFileSync(process.execPath, ['scripts/sync-claims.mjs', '--check'], {
  cwd: root,
  stdio: 'inherit',
})
console.log(
  `Static checks passed: ${manifest.length} pages; unique metadata, JSON-LD, 1200×630 images, links, claims, banned phrases`,
)
console.log(`JavaScript budget: ${(compressed / 1000).toFixed(2)} KB gzip / 150 KB`)
