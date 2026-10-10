export const stateLabels = {
  supported: 'Supported',
  beta: 'Beta',
  enterprise: 'Enterprise only',
  managed: 'Managed only',
  partial: 'Partial',
  absent: 'Not available',
  unknown: 'Not verified',
}

export function claimState(claim, gateway) {
  if (!claim || claim.status === 'unknown') return { key: 'unknown', label: stateLabels.unknown }
  let key = { yes: 'supported', partial: 'partial', no: 'absent' }[claim.status] || 'unknown'
  if (claim.status === 'yes') {
    if (claim.qualifier === 'beta') key = 'beta'
    else if (['enterprise', 'license'].includes(claim.qualifier)) key = 'enterprise'
    else if (gateway?.tier === 'managed') key = 'managed'
  }
  return { key, label: stateLabels[key] }
}
