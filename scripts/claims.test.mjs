import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { parseRegister, validateRegister } from './register.mjs'
import { makeClaims, assertCurrent, updateRegisterBlock } from './sync-claims.mjs'
import { claimState } from '../src/data/claim-state.js'

const fixture = `schema_version: 1
gateways:
- id: omniswitch
  name: OmniSwitch
  tier: harness
capabilities:
- id: chat
  name: Chat
claims:
- capability: chat
  gateway: omniswitch
  status: 'yes'
  detail: A folded detail with a colon: value,
    and an apostrophe in the gateway's text.
  source_url: internal/gateway/gateway.go
  verified_on: '2026-10-09'
  version: "v0.2.0"
`
const matrix = {
  hub_rows: ['chat', 'self-hosted'],
  optional_ids: ['self-hosted'],
  groups: [{ capabilities: ['chat'] }],
}
const pin = {
  source: { repo: 'owner/repo', commit: '1234567', path: 'docs/comparison/claims.yaml' },
  synced_on: '2026-10-09',
  sha256: createHash('sha256').update(fixture).digest('hex'),
}

test('every status and qualifier has a text state; unknown never means absent', () => {
  for (const [status, label] of Object.entries({
    yes: 'Supported',
    partial: 'Partial',
    no: 'Not available',
    unknown: 'Not verified',
  })) {
    assert.equal(claimState({ status }).label, label)
  }
  for (const [qualifier, label] of Object.entries({
    beta: 'Beta',
    enterprise: 'Enterprise only',
    license: 'Enterprise only',
  })) {
    assert.equal(claimState({ status: 'yes', qualifier }).label, label)
    assert.equal(claimState({ status: 'unknown', qualifier }).label, 'Not verified')
  }
  assert.equal(claimState({ status: 'yes' }, { tier: 'managed' }).label, 'Managed only')
  assert.equal(claimState({ status: 'partial' }, { tier: 'managed' }).label, 'Partial')
  assert.equal(claimState().label, 'Not verified')
})

test('flat register YAML preserves quoted, plain and folded text', () => {
  const parsed = parseRegister(fixture)
  assert.equal(parsed.schema_version, 1)
  assert.equal(parsed.claims[0].status, 'yes')
  assert.equal(
    parsed.claims[0].detail,
    "A folded detail with a colon: value, and an apostrophe in the gateway's text.",
  )
  assert.equal(parsed.claims[0].version, 'v0.2.0')
  assert.equal(
    parseRegister("schema_version: 1\ngenerated_note: 'It''s a\n  quoted note.'\n").generated_note,
    "It's a quoted note.",
  )
  assert.equal(
    parseRegister('schema_version: 1\ngenerated_note: |-\n  first\n  second\n').generated_note,
    'first\nsecond',
  )
  assert.throws(() => parseRegister('schema_version: 1\nschema_version: 2'), /Duplicate/)
  assert.throws(() => parseRegister('schema_version: &anchor 1'), /Unsupported/)
})

test('validation tolerates optional future capabilities, not invalid status or qualifier', () => {
  const parsed = parseRegister(fixture)
  assert.deepEqual(validateRegister(parsed, [], matrix), ['omniswitch'])
  assert.throws(
    () => validateRegister(parsed, [], { ...matrix, hub_rows: ['missing'] }),
    /Missing capability/,
  )
  parsed.claims[0].qualifier = 'beta'
  validateRegister(parsed, [], matrix)
  parsed.claims[0].qualifier = 'invented'
  assert.throws(() => validateRegister(parsed, [], matrix), /qualifier/)
  delete parsed.claims[0].qualifier
  parsed.claims[0].status = 'invented'
  assert.throws(() => validateRegister(parsed, [], matrix), /status/)
})

test('check catches hand edits, stale pins, changed sources and stale generated prose', () => {
  const claims = makeClaims(fixture, pin, [], matrix)
  const actual = JSON.stringify(claims, null, 2) + '\n'
  const markdown = updateRegisterBlock(
    'Copy\n<!-- claims:register:start -->\n<!-- claims:register:end -->\n',
    claims,
  )
  assertCurrent(actual, claims, pin, fixture, markdown)
  assert.throws(
    () =>
      assertCurrent(
        actual.replace('Supported', 'no').replace('"yes"', '"no"'),
        claims,
        pin,
        fixture,
        markdown,
      ),
    /hand-edited/,
  )
  assert.throws(() => makeClaims(fixture + '# changed\n', pin, [], matrix), /digest/)
  assert.throws(
    () => assertCurrent(actual, claims, { ...pin, sha256: 'stale' }, fixture, markdown),
    /Stale register pin/,
  )
  assert.throws(
    () => assertCurrent(actual, claims, pin, fixture, markdown.replace('Rows: 1', 'Rows: 2')),
    /register block is stale/,
  )
  const changed = makeClaims(
    fixture,
    { ...pin, source: { ...pin.source, commit: '7654321' } },
    [],
    matrix,
  )
  assert.throws(() => assertCurrent(actual, changed, pin, fixture, markdown), /pin is stale/)
})

test('corrected optional ids and qualifiers validate without changing source records', () => {
  const parsed = parseRegister(fixture)
  for (const id of ['self-hosted', 'token-rate-limits']) {
    parsed.capabilities.push({ id, name: id })
    parsed.claims.push({ ...parsed.claims[0], capability: id, qualifier: 'beta' })
  }
  const corrected = {
    ...matrix,
    hub_rows: ['chat', 'self-hosted', 'token-rate-limits'],
    optional_ids: ['self-hosted', 'token-rate-limits'],
  }
  assert.deepEqual(validateRegister(parsed, [], corrected), ['omniswitch'])
  assert.equal(claimState(parsed.claims[1]).label, 'Beta')
  parsed.claims[0].verified_on = '2026-02-30'
  assert.throws(() => validateRegister(parsed, [], corrected), /verified date/)
})
