import claims from './claims.json' with { type: 'json' }
import competitors from './compare/competitors.json' with { type: 'json' }
import matrix from './compare/matrix.json' with { type: 'json' }

export { claims, competitors, matrix }
const claimIndex = new Map(claims.claims.map((c) => [`${c.gateway}:${c.capability}`, c]))
const gatewayIndex = new Map(claims.gateways.map((g) => [g.id, g]))
const capabilityIndex = new Map(claims.capabilities.map((c) => [c.id, c]))

export const getClaim = (gateway, capability) => claimIndex.get(`${gateway}:${capability}`)
export const getGateway = (gateway) => gatewayIndex.get(gateway)
export const capabilityName = (id) => matrix.labels[id] || capabilityIndex.get(id)?.name || id
export const registerUrl = `https://github.com/${claims.source.repo}/blob/${claims.source.commit}/${claims.source.path}`

export function claimSource(claim) {
  if (!claim?.source_url) return registerUrl
  if (/^https?:\/\//.test(claim.source_url)) return claim.source_url
  if (claim.gateway === 'omniswitch')
    return `https://github.com/${claims.source.repo}/blob/${claims.source.commit}/${claim.source_url}`
  return registerUrl
}

export function latestReview(capabilities, gateways) {
  const rows = claims.claims.filter(
    (c) =>
      (!capabilities || capabilities.includes(c.capability)) &&
      (!gateways || gateways.includes(c.gateway)),
  )
  return rows.reduce((date, row) => (row.verified_on > date ? row.verified_on : date), '2026-09-11')
}

export function displayDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

export const hubColumns = [
  {
    id: 'omniswitch',
    name: 'OmniSwitch',
    footnote: 1,
    note: `Register ${claims.source.commit.slice(0, 7)}`,
  },
  ...competitors.map((c) => ({
    id: c.primary,
    name: c.name,
    footnote: c.footnote,
    note: c.column_note,
    slug: c.slug,
  })),
]

export function migrationEnabled(competitor) {
  return (
    !!competitor.migration &&
    getClaim('omniswitch', 'openai-compatible-chat')?.status === 'yes' &&
    getClaim(competitor.primary, 'openai-compatible-chat')?.status === 'yes'
  )
}

export function capabilityGroups() {
  const grouped = new Set(matrix.groups.flatMap((g) => g.capabilities))
  const extra = claims.capabilities.filter((c) => !grouped.has(c.id)).map((c) => c.id)
  return [
    ...matrix.groups,
    ...(extra.length ? [{ name: 'Other registered capabilities', capabilities: extra }] : []),
  ]
}
