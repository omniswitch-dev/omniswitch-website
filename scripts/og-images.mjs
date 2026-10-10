import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { routes, notFoundRoute } = await import(
  pathToFileURL(resolve(root, 'dist/.server/entry-server.js')).href
)
const escape = (text) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
function wrap(text, length = 32) {
  const lines = ['']
  for (const word of text.split(' ')) {
    if ((lines.at(-1) + ' ' + word).trim().length > length && lines.at(-1)) lines.push(word)
    else lines[lines.length - 1] = `${lines.at(-1)} ${word}`.trim()
  }
  return lines
}
for (const route of [...routes, notFoundRoute]) {
  const title = route.socialTitle || route.title.replace(/\s*[|—]\s*OmniSwitch$/, '')
  const lines = wrap(title)
  const fontSize = lines.length > 3 ? 48 : 58
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs><linearGradient id="accent"><stop stop-color="#4a00e0"/><stop offset="1" stop-color="#8e2de2"/></linearGradient><radialGradient id="glow"><stop stop-color="#8e2de2" stop-opacity=".12"/><stop offset="1" stop-color="#06060a" stop-opacity="0"/></radialGradient></defs>
    <rect width="1200" height="630" fill="#06060a"/><ellipse cx="980" cy="240" rx="410" ry="370" fill="url(#glow)"/>
    <rect x="38" y="38" width="1124" height="554" rx="16" fill="none" stroke="#ffffff" stroke-opacity=".1"/>
    <path d="M80 98V70c13 0 25-7 34-14 9 7 21 14 34 14v28c0 23-16 36-34 42-18-6-34-19-34-42Z" fill="none" stroke="#c98eff" stroke-width="3"/>
    <text x="169" y="107" font-family="DejaVu Sans" font-size="33" fill="#ededed" font-weight="600">OmniSwitch</text>
    <text x="80" y="196" font-family="DejaVu Sans" font-size="15" fill="#c98eff" letter-spacing="2">SECURE SELF-HOSTED AI CONTROL</text>
    ${lines.map((line, index) => `<text x="77" y="${278 + index * (fontSize + 12)}" font-family="DejaVu Sans" font-size="${fontSize}" fill="${index === lines.length - 1 ? '#c98eff' : '#ededed'}" font-weight="600">${escape(line)}</text>`).join('')}
    <line x1="80" y1="518" x2="1120" y2="518" stroke="#ffffff" stroke-opacity=".1"/>
    <text x="80" y="555" font-family="DejaVu Sans" font-size="18" fill="#a9a9b3">omniswitch.dev</text>
    <text x="1120" y="555" text-anchor="end" font-family="DejaVu Sans" font-size="15" fill="#a9a9b3">OPEN SOURCE · PUBLIC BETA</text>
  </svg>`
  const image = new Resvg(svg, {
    font: { loadSystemFonts: true, defaultFontFamily: 'DejaVu Sans' },
  })
    .render()
    .asPng()
  const filename = resolve(root, 'public', route.ogImage.slice(1))
  await mkdir(dirname(filename), { recursive: true })
  await writeFile(filename, image)
}
console.log(`Generated ${routes.length + 1} social images at 1200 × 630`)
