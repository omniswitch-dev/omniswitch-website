const voidTags = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

export function decodeHtml(text) {
  return text
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, value) =>
      String.fromCodePoint(
        value[0].toLowerCase() === 'x' ? parseInt(value.slice(1), 16) : Number(value),
      ),
    )
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
}

export function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)].map(([, key, value]) => [
      key,
      decodeHtml(value),
    ]),
  )
}

export function visibleText(html, { excludeEvidence = false, excludeBenchmark = false } = {}) {
  const stack = []
  const text = []
  let skipped = 0
  for (const token of html.match(/<[^>]*>|[^<]+/g) || []) {
    if (token.startsWith('<!')) continue
    if (!token.startsWith('<')) {
      if (!skipped) text.push(token)
      continue
    }
    const name = token.match(/^<\/?([\w-]+)/)?.[1]?.toLowerCase()
    if (!name) continue
    if (token.startsWith('</')) {
      let entry
      do {
        entry = stack.pop()
        if (entry?.skip) skipped--
      } while (entry && entry.name !== name)
    } else if (!voidTags.has(name) && !token.endsWith('/>')) {
      const skip =
        name === 'script' ||
        name === 'style' ||
        (excludeEvidence && token.includes('data-claim-evidence=')) ||
        (excludeBenchmark && token.includes('data-benchmark-evidence='))
      stack.push({ name, skip })
      if (skip) skipped++
    }
  }
  return decodeHtml(text.join(' ')).replace(/\s+/g, ' ').trim()
}

export function metaMap(html) {
  const tags = [...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => attributes(tag))
  const map = new Map()
  for (const tag of tags) {
    const key = tag.name || tag.property
    if (!key) continue
    if (map.has(key)) throw new Error(`Duplicate meta: ${key}`)
    map.set(key, tag.content)
  }
  return map
}

export function internalLinks(html) {
  return [...html.matchAll(/<a\b[^>]*>/g)]
    .map(([tag]) => attributes(tag).href)
    .filter((href) => href?.startsWith('/') || href?.startsWith('#'))
}
