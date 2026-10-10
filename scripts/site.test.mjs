import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { jsonLd, metadata, renderHead } from '../src/seo.js'
import { archiveName, installCommand, verificationCommand } from '../src/data/product.js'
import release from '../src/data/release.json' with { type: 'json' }
import { claimState } from '../src/data/claim-state.js'
import {
  competitors,
  migrationEnabled,
  capabilityGroups,
  claims,
  matrix,
  getClaim,
} from '../src/data/comparison.js'
import { attributes, internalLinks, visibleText } from './html.mjs'
import { bannedHits, validatePage } from './dist-checks.mjs'

const rules = JSON.parse(await readFile(new URL('./banned-phrases.json', import.meta.url), 'utf8'))
const route = {
  path: '/docs',
  label: 'Documentation',
  title: 'Inspect your AI gateway | OmniSwitch',
  description:
    'Operate the self-hosted OmniSwitch control plane with explicit authentication, routing, policy, and agent protocol boundaries.',
  ogImage: '/og/docs.png',
  updated: '2026-10-09',
}
const document = (r = route) =>
  `<html><head>${renderHead(r)}</head><body><main><h1>Inspect the gateway</h1><p>${'Visible prerendered content. '.repeat(35)}</p></main></body></html>`

test('route metadata includes canonical, social images, and dated breadcrumbs', () => {
  const head = metadata(route)
  assert.equal(head.canonical, 'https://omniswitch.dev/docs')
  assert.equal(
    head.meta.find(([, name]) => name === 'og:image')[2],
    'https://omniswitch.dev/og/docs.png',
  )
  assert.deepEqual(
    head.jsonLd.map((entry) => entry['@type']),
    ['BreadcrumbList', 'WebPage'],
  )
  assert.equal(head.jsonLd[1].dateModified, route.updated)
  const competitor = jsonLd({ ...route, path: '/compare/litellm', label: 'LiteLLM' })
  assert.deepEqual(
    competitor[0].itemListElement.map((item) => item.name),
    ['OmniSwitch', 'Compare', 'LiteLLM'],
  )
})

test('home structured data has no invented search, ratings, or reviews', () => {
  const data = jsonLd({ ...route, path: '/' })
  assert.equal(data[0]['@type'], 'SoftwareApplication')
  assert.equal(
    data[0].softwareVersion,
    release.published ? release.version : `${release.version}-pre-release`,
  )
  assert.equal(data[0].offers.price, '0')
  assert.doesNotMatch(JSON.stringify(data), /SearchAction|AggregateRating|Review|FAQPage/)
})

test('head output escapes HTML and JSON-LD cannot close its script', () => {
  const html = renderHead({
    ...route,
    title: 'A < B & C',
    description: `${route.description} </script>`,
  })
  assert.match(html, /<title>A &lt; B &amp; C<\/title>/)
  assert.equal((html.match(/<\/script>/g) || []).length, 1)
  assert.match(html, /\\u003c\/script>/)
})

test('static validation rejects missing headings, metadata, blank shells and duplicates', () => {
  assert.equal(validatePage(document(), route, rules).canonical, 'https://omniswitch.dev/docs')
  assert.throws(() => validatePage(document().replace('<h1>', '<h2>'), route, rules), /one h1/)
  assert.throws(
    () =>
      validatePage(document().replace('</head>', '<title>Duplicate</title></head>'), route, rules),
    /one title/,
  )
  assert.throws(
    () => validatePage(document().replace(route.description, 'Too short'), route, rules),
    /description/,
  )
  assert.throws(
    () => validatePage(document().replace('rel="canonical"', 'rel="alternate"'), route, rules),
    /canonical/,
  )
  assert.throws(
    () => validatePage(document().replace('summary_large_image', 'summary'), route, rules),
    /twitter:card/,
  )
  assert.throws(
    () =>
      validatePage(
        document().replace(/<main>.*<\/main>/, '<main><h1>Empty</h1></main>'),
        route,
        rules,
      ),
    /empty or incomplete/,
  )
})

test('marketing bans distinguish published evidence from unsupported website claims', () => {
  for (const phrase of [
    'the first A2A gateway',
    'unique token exchange',
    'semantic cache',
    '250+ providers',
    'full OpenAI parity',
    'SOC 2',
    'enterprise-ready',
    'drop-in migration',
    'the fastest gateway',
    '0.66ms added latency',
  ]) {
    assert.ok(bannedHits(`<p>${phrase}</p>`, rules).length > 0, phrase)
  }
  assert.deepEqual(bannedHits('<p>Lexical similarity cache, not embeddings.</p>', rules), [])
  assert.deepEqual(
    bannedHits(
      '<div data-claim-evidence="register"><p>Cited competitor semantic cache scope.</p></div>',
      rules,
    ),
    [],
  )
  assert.deepEqual(
    bannedHits(
      '<div data-benchmark-evidence="published"><p>1.48 ms from a published component benchmark.</p></div>',
      rules,
    ),
    [],
  )
  assert.ok(
    bannedHits('<div data-claim-evidence="register">unique token exchange</div>', rules).length,
  )
})

test('HTML extraction handles nested evidence, entity decoding, and real links', () => {
  assert.deepEqual(attributes('<a href="/compare?a=1&amp;b=2" id="x">'), {
    href: '/compare?a=1&b=2',
    id: 'x',
  })
  assert.deepEqual(
    internalLinks(
      '<a href="/compare">A</a><a href="#sources">B</a><a href="https://example.com">C</a>',
    ),
    ['/compare', '#sources'],
  )
  assert.equal(
    visibleText(
      '<p>Visible</p><div data-claim-evidence="register"><p>Hidden <b>nested</b></p></div><p>Again</p>',
      { excludeEvidence: true },
    ),
    'Visible Again',
  )
})

test('release paths do not assume an unpublished tag and archive names omit v', () => {
  assert.equal(archiveName(), 'omniswitch_0.2.0_linux_amd64.tar.gz')
  assert.equal(archiveName('darwin', 'arm64'), 'omniswitch_0.2.0_darwin_arm64.tar.gz')
  assert.equal(archiveName('windows', 'amd64'), 'omniswitch_0.2.0_windows_amd64.zip')
  if (release.published) assert.ok(installCommand().includes(release.tag))
  else {
    assert.ok(installCommand().includes(`git checkout ${release.prerelease.commit}`))
    assert.doesNotMatch(installCommand(), /releases\/download|0\.2\.0-beta\.1/)
  }
  assert.match(verificationCommand(), /cosign verify-blob checksums.txt/)
  assert.match(verificationCommand(), /gh attestation verify omniswitch_0.2.0_linux_amd64.tar.gz/)
})

test('migration guides are gated by verified chat support; all register ids are grouped', () => {
  assert.deepEqual(
    competitors.filter(migrationEnabled).map((c) => c.slug),
    competitors
      .filter(
        (c) =>
          c.migration &&
          getClaim(c.primary, 'openai-compatible-chat')?.status === 'yes' &&
          getClaim('omniswitch', 'openai-compatible-chat')?.status === 'yes',
      )
      .map((c) => c.slug),
  )
  assert.equal(migrationEnabled({ ...competitors[0], primary: 'missing' }), false)
  const ids = capabilityGroups().flatMap((group) => group.capabilities)
  for (const capability of claims.capabilities)
    assert.ok(ids.includes(capability.id), capability.id)
  for (const id of matrix.optional_ids) {
    const claim = getClaim('omniswitch', id)
    if (!claim) assert.equal(claimState(claim).label, 'Not verified')
    else assert.ok(['yes', 'partial', 'no', 'unknown'].includes(claim.status))
  }
})
