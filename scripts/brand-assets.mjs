import { mkdir, writeFile } from 'node:fs/promises'
import { Resvg } from '@resvg/resvg-js'
import { markPath, brandColors } from '../src/data/brand.js'

const root = new URL('../public/', import.meta.url)
const path = (color) =>
  `<path d="${markPath}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`
const mark = (color, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><title>OmniSwitch</title>${extra}${path(color)}</svg>`
const wordmark = (color, text) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="72" viewBox="0 0 360 72"><title>OmniSwitch</title><g transform="translate(4 4)">${path(color)}</g><text x="84" y="50" fill="${text}" font-family="DejaVu Sans,Arial,Helvetica,sans-serif" font-size="41" font-weight="600" letter-spacing="-1.7">OmniSwitch</text></svg>`
const png = (svg, width) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: { loadSystemFonts: true } })
    .render()
    .asPng()
await mkdir(new URL('brand/', root), { recursive: true })
for (const [name, svg, width] of [
  ['omniswitch-mark', mark(brandColors.violet), 512],
  ['omniswitch-mark-light', mark(brandColors.light), 512],
  ['omniswitch-wordmark', wordmark(brandColors.violet, brandColors.ink), 1080],
  ['omniswitch-wordmark-light', wordmark(brandColors.light, brandColors.white), 1080],
]) {
  await writeFile(new URL(`brand/${name}.svg`, root), `${svg}\n`)
  await writeFile(new URL(`brand/${name}.png`, root), png(svg, width))
}
await writeFile(
  new URL('favicon.svg', root),
  `${mark(brandColors.violet, '<style>@media(prefers-color-scheme:dark){path{stroke:#c7a7f3}}</style>')}\n`,
)
const tile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="20" fill="#fcfcfd"/><g transform="translate(16 16)">${path(brandColors.violet)}</g></svg>`
for (const size of [180, 192, 512]) {
  await writeFile(new URL(`brand/icon-${size}.png`, root), png(tile, size))
}
console.log('Generated shared SVG, PNG, favicon, and home-screen brand assets')
