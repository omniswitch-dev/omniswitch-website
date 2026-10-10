import { readFile } from 'node:fs/promises'
import { archiveName } from '../src/data/product.js'

const release = JSON.parse(
  await readFile(new URL('../src/data/release.json', import.meta.url), 'utf8'),
)
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'OmniSwitch-release-link-check',
}
let failures = 0
async function check(label, url, options = {}) {
  try {
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(15000), ...options })
    console.log(`${label}: ${response.status}`)
    if (!response.ok) failures++
    return response
  } catch (error) {
    console.log(`${label}: ${error.name}`)
    failures++
    return null
  }
}
console.log(`${release.tag}: published flag is ${release.published}. This check never changes it.`)
const tagged = await check(
  'GitHub release',
  `https://api.github.com/repos/${release.repo}/releases/tags/${release.tag}`,
)
if (tagged?.ok) {
  const data = await tagged.json()
  const names = new Set(data.assets.map((a) => a.name))
  for (const name of [archiveName(), 'checksums.txt', 'checksums.txt.sig', 'checksums.txt.pem']) {
    if (!names.has(name)) {
      console.log(`Missing release asset: ${name}`)
      failures++
    }
  }
}
await check('Install script', release.install_script, { method: 'HEAD' })
const formula = await check(
  'Homebrew formula',
  'https://api.github.com/repos/omniswitch-dev/homebrew-tap/contents/Formula/omniswitch.rb',
)
if (formula?.ok) {
  const data = await formula.json()
  if (!Buffer.from(data.content, 'base64').toString('utf8').includes(release.tag)) {
    console.log('Homebrew formula is not yet pinned to the target release')
    failures++
  }
}
const tokenResponse = await check(
  'Registry pull authorization',
  'https://ghcr.io/token?service=ghcr.io&scope=repository:omniswitch-dev/omniswitch:pull',
)
if (tokenResponse?.ok) {
  const { token } = await tokenResponse.json()
  await check(
    'Versioned container manifest',
    `https://ghcr.io/v2/omniswitch-dev/omniswitch/manifests/${release.version}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept:
          'application/vnd.oci.image.index.v1+json, application/vnd.docker.distribution.manifest.list.v2+json',
      },
    },
  )
}
if (failures) {
  console.log(
    `${failures} release checks need attention. Leave published false until the release assets, image, and tap are verified.`,
  )
  process.exitCode = 1
}
