import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { parseRegister, validateRegister } from './register.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const registerPath = 'docs/comparison/claims.yaml'
const defaultRepo = 'omniswitch-dev/omniswitch'
const start = '<!-- claims:register:start -->'
const end = '<!-- claims:register:end -->'
const json = (value) => `${JSON.stringify(value, null, 2)}\n`
const digest = (text) => createHash('sha256').update(text).digest('hex')

export function makeClaims(text, pin, competitors, matrix) {
  if (digest(text) !== pin.sha256) throw new Error('Register differs from the pinned source digest')
  const register = parseRegister(text)
  const keep = new Set(validateRegister(register, competitors, matrix))
  return {
    schema_version: register.schema_version,
    source: pin.source,
    synced_on: pin.synced_on,
    gateways: register.gateways.filter((g) => keep.has(g.id)),
    capabilities: register.capabilities,
    claims: register.claims.filter((c) => keep.has(c.gateway)),
  }
}

export function registerBlock(claims) {
  const counts = { yes: 0, partial: 0, no: 0, unknown: 0 }
  for (const claim of claims.claims) counts[claim.status]++
  return (
    `${start}\n\n## Generated comparison register\n\n` +
    `- Repository: https://github.com/${claims.source.repo}\n` +
    `- Register: https://github.com/${claims.source.repo}/blob/${claims.source.commit}/${claims.source.path}\n` +
    `- Pinned commit: \`${claims.source.commit}\`\n` +
    `- Synced on: ${claims.synced_on}\n` +
    `- Gateways: ${claims.gateways.map((g) => `\`${g.id}\``).join(', ')}\n` +
    `- Rows: ${claims.claims.length}; yes ${counts.yes}, partial ${counts.partial}, no ${counts.no}, unknown ${counts.unknown}.\n\n` +
    `Cells are copied without local status or detail overrides. Empty capability-source URLs link to the pinned register and are labelled as an evidence gap. Missing optional capabilities render Not verified.\n\n${end}`
  )
}

export function updateRegisterBlock(markdown, claims) {
  const first = markdown.indexOf(start)
  const last = markdown.indexOf(end)
  if (first < 0 || last < first || markdown.indexOf(start, first + start.length) >= 0)
    throw new Error('CLAIMS.md needs exactly one register block')
  return markdown.slice(0, first) + registerBlock(claims) + markdown.slice(last + end.length)
}

export function assertCurrent(actual, expected, pin, text, markdown) {
  if (digest(text) !== pin.sha256) throw new Error('Stale register pin: source digest changed')
  if (actual !== json(expected))
    throw new Error('claims.json was hand-edited or its pin is stale; run claims:sync')
  if (markdown !== updateRegisterBlock(markdown, expected))
    throw new Error('CLAIMS.md register block is stale')
}

async function fetchRegister(source) {
  const url = `https://raw.githubusercontent.com/${source.repo}/${source.commit}/${source.path}`
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) })
  if (!response.ok) throw new Error(`Pinned register fetch returned ${response.status}: ${url}`)
  return response.text()
}

async function readPinned(source) {
  // The parallel product checkout may contain a commit not pushed yet. Read its
  // immutable git blob, never its working tree. CI uses the exact same raw blob.
  const sibling = resolve(root, '..', 'omniswitch')
  try {
    const remote = execFileSync('git', ['-C', sibling, 'remote', 'get-url', 'origin'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    if (!remote.replace(/\.git$/, '').endsWith(`/${source.repo}`))
      throw new Error('Different repository')
    return execFileSync('git', ['-C', sibling, 'show', `${source.commit}:${source.path}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 10 * 1024 * 1024,
    })
  } catch {
    return fetchRegister(source)
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      from: { type: 'string' },
      commit: { type: 'string' },
      repo: { type: 'string' },
      check: { type: 'boolean', default: false },
    },
  })
  const path = (name) => resolve(root, name)
  const competitors = JSON.parse(await readFile(path('src/data/compare/competitors.json'), 'utf8'))
  const matrix = JSON.parse(await readFile(path('src/data/compare/matrix.json'), 'utf8'))
  const markdown = await readFile(path('CLAIMS.md'), 'utf8')
  let existing
  try {
    existing = JSON.parse(await readFile(path('src/data/claims-pin.json'), 'utf8'))
  } catch {
    /* first sync */
  }
  let commit = values.commit || existing?.source.commit
  let repo =
    values.repo ||
    (values.check || (!values.commit && !values.from)
      ? existing?.source.repo || defaultRepo
      : defaultRepo)
  let text
  if (values.from) {
    const filename = resolve(values.from)
    text = await readFile(filename, 'utf8')
    if (!values.commit && !values.check) {
      try {
        commit = execFileSync('git', ['-C', dirname(filename), 'rev-parse', 'HEAD'], {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
        }).trim()
        const blob = execFileSync(
          'git',
          ['-C', dirname(filename), 'show', `${commit}:${registerPath}`],
          { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 10 * 1024 * 1024 },
        )
        if (blob !== text) throw new Error('Dirty source register')
      } catch {
        throw new Error('--from needs a committed register, or an explicit --commit pin')
      }
    }
  }
  if (!commit || !/^[a-f\d]{7,40}$/i.test(commit))
    throw new Error('Supply --commit <immutable git SHA>')
  if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error('Invalid --repo owner/name')
  const source = { repo, path: registerPath, commit }
  if (values.check && (!existing || json(source) !== json(existing.source)))
    throw new Error('Requested commit/repository differs from the pin')
  if (!text)
    text = values.commit && !values.check ? await fetchRegister(source) : await readPinned(source)
  const pin = values.check
    ? existing
    : {
        source,
        sha256: digest(text),
        synced_on:
          existing && existing.source.commit === commit && existing.sha256 === digest(text)
            ? existing.synced_on
            : new Date().toISOString().slice(0, 10),
      }
  const claims = makeClaims(text, pin, competitors, matrix)
  if (values.check) {
    assertCurrent(await readFile(path('src/data/claims.json'), 'utf8'), claims, pin, text, markdown)
    console.log(`Claims verified: ${claims.claims.length} rows at ${commit}`)
  } else {
    await writeFile(path('src/data/claims.json'), json(claims))
    await writeFile(path('src/data/claims-pin.json'), json(pin))
    await writeFile(path('CLAIMS.md'), updateRegisterBlock(markdown, claims))
    console.log(`Claims synced: ${claims.claims.length} rows at ${commit}`)
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
