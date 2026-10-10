export function isSafePreviewPath(path) {
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return false
  for (const character of path) {
    const codePoint = character.codePointAt(0)
    if (codePoint < 32 || codePoint === 127) return false
  }
  return true
}

export function encodePreviewPath(path) {
  return path.split('/').map(encodeURIComponent).join('/')
}
