import { readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { gzipSync } from 'node:zlib'
import { encodePreviewPath, isSafePreviewPath } from './preview-path.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')
const { values } = parseArgs({
  options: {
    host: { type: 'string', default: '127.0.0.1' },
    port: { type: 'string', default: '4173' },
  },
})
const routes = new Map(
  JSON.parse(await readFile(resolve(root, 'route-manifest.json'), 'utf8')).map((r) => [
    r.path,
    r.output,
  ]),
)
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
}
const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405)
    response.end()
    return
  }
  let url
  try {
    url = new URL(request.url, 'http://localhost')
  } catch {
    response.writeHead(400)
    response.end()
    return
  }
  let path
  try {
    path = decodeURIComponent(url.pathname)
  } catch {
    response.writeHead(400)
    response.end()
    return
  }
  if (!isSafePreviewPath(path)) {
    response.writeHead(400)
    response.end()
    return
  }
  let redirect
  if (path === '/comparison') redirect = '/compare'
  else if (path.endsWith('/index.html')) redirect = path.slice(0, -11) || '/'
  else if (path !== '/' && path.endsWith('/')) redirect = path.replace(/\/+$/, '')
  if (redirect) {
    response.writeHead(308, { Location: encodePreviewPath(redirect) + url.search })
    response.end()
    return
  }
  let filename = resolve(root, routes.get(path) || path.slice(1))
  let status = path === '/404' || path === '/404.html' ? 404 : 200
  try {
    if (!filename.startsWith(root + '/') || !(await stat(filename)).isFile())
      throw new Error('Missing file')
  } catch {
    filename = resolve(root, '404.html')
    status = 404
  }
  let body
  try {
    body = await readFile(filename)
  } catch {
    response.writeHead(503)
    response.end('Build in progress')
    return
  }
  const type = types[extname(filename)] || 'application/octet-stream'
  const headers = {
    'Content-Type': type,
    'Cache-Control': path.startsWith('/assets/')
      ? 'public, max-age=31536000, immutable'
      : 'no-cache',
  }
  if (/^(?:text\/|application\/(?:json|xml)|image\/svg)/.test(type)) {
    headers.Vary = 'Accept-Encoding'
    const acceptsGzip = (request.headers['accept-encoding'] || '').split(',').some((value) => {
      const [encoding, quality] = value.trim().split(';')
      const q = quality ? Number(quality.trim().split('=')[1]) : 1
      return encoding.toLowerCase() === 'gzip' && q > 0 && q <= 1
    })
    if (acceptsGzip && body.length > 1024) {
      body = gzipSync(body)
      headers['Content-Encoding'] = 'gzip'
    }
  }
  headers['Content-Length'] = body.length
  response.writeHead(status, headers)
  response.end(request.method === 'HEAD' ? undefined : body)
})
server.listen(Number(values.port), values.host, () =>
  console.log(`Static website preview: http://${values.host}:${values.port}`),
)
