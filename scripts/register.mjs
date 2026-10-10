// The register schema is deliberately flat: scalars and lists of scalar records.
// Reject other YAML constructs rather than guess at their meaning. No YAML runtime
// dependency is needed, and register formatting remains independently testable.
export function parseRegister(text) {
  const result = {}
  let section
  let record = result
  let itemIndent = -1
  let pending

  function flush() {
    if (!pending) return
    const { key, parts, block, target } = pending
    let raw = block ? parts.slice(1).join(block.startsWith('|') ? '\n' : ' ') : parts.join(' ')
    let value
    if (block) value = raw + (block.endsWith('-') ? '' : '\n')
    else if (raw.startsWith('"')) {
      try {
        value = JSON.parse(raw)
      } catch {
        throw new Error(`Invalid quoted scalar: ${key}`)
      }
    } else if (raw.startsWith("'")) {
      if (!raw.endsWith("'")) throw new Error(`Unclosed quoted scalar: ${key}`)
      value = raw.slice(1, -1).replaceAll("''", "'")
    } else {
      raw = raw.replace(/\s+#.*$/, '')
      if (/^[&*![{]/.test(raw)) throw new Error(`Unsupported YAML construct: ${key}`)
      value = key === 'schema_version' ? Number(raw) : raw
    }
    if (Object.hasOwn(target, key)) throw new Error(`Duplicate register field: ${key}`)
    target[key] = value
    pending = undefined
  }

  for (const [index, line] of text.replaceAll('\r\n', '\n').split('\n').entries()) {
    if (/^\s*(#|$)/.test(line)) continue
    if (line.includes('\t')) throw new Error(`Tabs are not supported at line ${index + 1}`)
    const top = line.match(/^([a-z_]+):\s*(.*)$/)
    const item = line.match(/^(\s*)- ([a-z_]+):\s*(.*)$/)
    const field = line.match(/^(\s+)([a-z_]+):\s*(.*)$/)
    if (top) {
      flush()
      const [, key, value] = top
      if (['gateways', 'capabilities', 'claims'].includes(key)) {
        if (value || Object.hasOwn(result, key)) throw new Error(`Invalid list: ${key}`)
        result[key] = []
        section = key
        record = undefined
        itemIndent = -1
      } else {
        section = undefined
        record = result
        pending = { key, parts: [value], target: record, indent: 0 }
      }
    } else if (item) {
      flush()
      if (!section) throw new Error(`Unexpected list at line ${index + 1}`)
      itemIndent = item[1].length
      record = {}
      result[section].push(record)
      pending = { key: item[2], parts: [item[3]], target: record, indent: itemIndent + 2 }
    } else if (field && field[1].length === itemIndent + 2 && record && section) {
      flush()
      pending = { key: field[2], parts: [field[3]], target: record, indent: field[1].length }
    } else if (pending && line.match(/^\s*/)[0].length > pending.indent) {
      pending.parts.push(line.trim())
    } else {
      throw new Error(`Unsupported register syntax at line ${index + 1}`)
    }
    if (pending && /^[>|]-?$/.test(pending.parts[0])) pending.block = pending.parts[0]
  }
  flush()
  return result
}

const statuses = new Set(['yes', 'partial', 'no', 'unknown'])
const qualifiers = new Set(['beta', 'enterprise', 'license'])

function uniqueIds(rows, label) {
  if (!Array.isArray(rows)) throw new Error(`Missing ${label}`)
  const ids = new Set()
  for (const row of rows) {
    if (!/^[a-z0-9-]+$/.test(row.id) || !row.name || ids.has(row.id))
      throw new Error(`Invalid ${label} id: ${row.id}`)
    ids.add(row.id)
  }
  return ids
}

export function validateRegister(register, competitors, matrix) {
  if (register.schema_version !== 1) throw new Error('Unsupported register schema')
  const gateways = uniqueIds(register.gateways, 'gateways')
  const capabilities = uniqueIds(register.capabilities, 'capabilities')
  const required = [
    'omniswitch',
    ...competitors.flatMap((c) => [c.primary, ...c.editions.map((e) => e.id)]),
  ]
  for (const id of required) if (!gateways.has(id)) throw new Error(`Missing gateway: ${id}`)
  const grouped = matrix.groups.flatMap((group) => group.capabilities)
  for (const id of [...matrix.hub_rows, ...grouped]) {
    if (!capabilities.has(id) && !matrix.optional_ids.includes(id))
      throw new Error(`Missing capability: ${id}`)
  }
  if (!Array.isArray(register.claims)) throw new Error('Missing claims')
  const pairs = new Set()
  for (const claim of register.claims) {
    const key = `${claim.gateway}:${claim.capability}`
    if (!gateways.has(claim.gateway) || !capabilities.has(claim.capability) || pairs.has(key))
      throw new Error(`Invalid claim pair: ${key}`)
    pairs.add(key)
    if (!statuses.has(claim.status)) throw new Error(`Invalid status: ${key}`)
    if (claim.qualifier && !qualifiers.has(claim.qualifier))
      throw new Error(`Invalid qualifier: ${key}`)
    const date = new Date(claim.verified_on)
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(claim.verified_on) ||
      Number.isNaN(date.valueOf()) ||
      date.toISOString().slice(0, 10) !== claim.verified_on
    )
      throw new Error(`Invalid verified date: ${key}`)
    for (const field of ['detail', 'version', 'source_url']) {
      if (typeof claim[field] !== 'string') throw new Error(`Missing ${field}: ${key}`)
    }
    // Older evidence-gap rows record an empty URL, even for some `no` states.
    // Preserve those rows verbatim and expose the register as their provenance.
    if (
      claim.source_url &&
      !/^https?:\/\//.test(claim.source_url) &&
      (/^[/.]/.test(claim.source_url) || claim.source_url.includes('..'))
    ) {
      throw new Error(`Unsafe source path: ${key}`)
    }
  }
  return required
}
