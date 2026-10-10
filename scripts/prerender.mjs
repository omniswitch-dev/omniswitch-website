import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const { routes, notFoundRoute, render } = await import(
  pathToFileURL(resolve(dist, '.server/entry-server.js')).href
)
const template = await readFile(resolve(dist, 'index.html'), 'utf8')
if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->'))
  throw new Error('Vite template placeholders are missing')
const manifest = []
for (const route of [...routes, notFoundRoute]) {
  const { html, head } = await render(route.path)
  const output =
    route.path === '/'
      ? 'index.html'
      : route.path === '/404'
        ? '404.html'
        : `${route.path.slice(1)}/index.html`
  const filename = resolve(dist, output)
  await mkdir(dirname(filename), { recursive: true })
  await writeFile(
    filename,
    template.replace('<!--app-head-->', head).replace('<!--app-html-->', html),
  )
  const { component: _component, ...data } = route
  manifest.push({ ...data, output })
}
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  routes
    .map(
      (route) =>
        `  <url><loc>https://omniswitch.dev${route.path}</loc><lastmod>${route.updated}</lastmod></url>`,
    )
    .join('\n') +
  '\n</urlset>\n'
await writeFile(resolve(dist, 'sitemap.xml'), sitemap)
await writeFile(
  resolve(dist, 'robots.txt'),
  'User-agent: *\nAllow: /\nSitemap: https://omniswitch.dev/sitemap.xml\n',
)
await writeFile(resolve(dist, 'route-manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
await rm(resolve(dist, '.server'), { recursive: true })
console.log(`Prerendered ${routes.length} routes and 404; sitemap and robots generated`)
