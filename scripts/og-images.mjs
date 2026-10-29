import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { routes, notFoundRoute } = await import(
  pathToFileURL(resolve(root, 'dist/.server/entry-server.js')).href
)
const logo = (await readFile(resolve(root, 'public/brand/omniswitch-mark.svg'), 'utf8')).replace(
  /<\/?svg[^>]*>|<title>.*?<\/title>/g,
  '',
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
  const lines = route.path === '/' ? ['One gateway for', 'models and tools.'] : wrap(title)
  const fontSize = route.path === '/' ? 72 : lines.length > 3 ? 48 : 58
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#fcfcfd"/>
    <rect x="38" y="38" width="1124" height="554" rx="8" fill="none" stroke="#e3e2e8"/>
    <g transform="translate(78 62) scale(.76)">${logo}</g>
    <text x="149" y="107" font-family="DejaVu Sans" font-size="33" fill="#242329" font-weight="600">OmniSwitch</text>
    <text x="1120" y="104" text-anchor="end" font-family="DejaVu Sans Mono" font-size="14" fill="#65636f">OS / OPEN SOURCE</text>
    <circle cx="85" cy="184" r="4" fill="#7542bf"/><text x="102" y="189" font-family="DejaVu Sans Mono" font-size="13" fill="#65636f" letter-spacing="1">SELF-HOSTED AI GATEWAY</text>
    ${lines.map((line, index) => `<text x="77" y="${275 + index * (fontSize + 10)}" font-family="DejaVu Sans" font-size="${fontSize}" fill="${index === lines.length - 1 ? '#7542bf' : '#242329'}" font-weight="600" letter-spacing="-2">${escape(line)}</text>`).join('')}
    <line x1="80" y1="518" x2="1120" y2="518" stroke="#e3e2e8"/>
    <text x="80" y="555" font-family="DejaVu Sans Mono" font-size="17" fill="#65636f">omniswitch.dev</text>
    <text x="1120" y="555" text-anchor="end" font-family="DejaVu Sans Mono" font-size="13" fill="#7542bf">SELF-HOSTED / PUBLIC BETA</text>
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
