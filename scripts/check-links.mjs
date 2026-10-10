import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { attributes } from './html.mjs'

if (!process.argv.includes('--external'))
  throw new Error('Use --external for the manual, report-only link review')
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(await readFile(resolve(root, 'dist/route-manifest.json'), 'utf8'))
const links = new Set()
for (const route of manifest) {
  const html = await readFile(resolve(root, 'dist', route.output), 'utf8')
  for (const [tag] of html.matchAll(/<a\b[^>]*>/g)) {
    const href = attributes(tag).href
    if (/^https?:\/\//.test(href)) links.add(href)
  }
}
const pending = [...links]
const results = []
async function worker() {
  while (pending.length) {
    const url = pending.shift()
    try {
      let response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(10000),
      })
      if ([403, 405].includes(response.status))
        response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(10000) })
      results.push({ url, status: response.status })
    } catch (error) {
      results.push({ url, error: error.name })
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker))
const failed = results.filter((r) => r.error || r.status >= 400)
console.log(
  `External link review (report only): ${results.length} URLs; ${results.length - failed.length} successful; ${failed.length} need review`,
)
for (const result of failed) console.log(`${result.error || result.status} ${result.url}`)
console.log(
  'Unpublished product pins can return 404 until the integrator pushes them. 403/429/timeouts are unverified, not proof that a source does not exist.',
)
