import release from './release.json' with { type: 'json' }

export const A2A_SCOPE =
  'SendMessage, SendMessageStream (SSE task events), GetTask, best-effort CancelTask; tasks in memory; no push notifications; no downstream agent proxy.'
export const repoUrl = `https://github.com/${release.repo}`
export const productDoc = (path) => `${repoUrl}/blob/main/${path}`

export function archiveName(os = 'linux', arch = 'amd64') {
  const template = os === 'windows' ? release.archive_windows_template : release.archive_template
  return template
    .replace('{version}', release.version.replace(/^v/, ''))
    .replace('{os}', os)
    .replace('{arch}', arch)
}

export function installCommand() {
  return release.published
    ? `curl -fsSL ${release.install_script} -o install.sh\nOMNISWITCH_VERSION=${release.tag} sh install.sh`
    : release.prerelease.install
}

export function dockerCommand() {
  return release.published
    ? `docker run --rm -p 8080:8080 --env-file .env.local \\\n  -v omniswitch-data:/data ${release.docker_image}`
    : release.prerelease.docker
}

export function verificationCommand() {
  const base = `${repoUrl}/releases/download/${release.tag}`
  const archive = archiveName()
  return `curl -fsSLO ${base}/${archive}\ncurl -fsSLO ${base}/checksums.txt\ncurl -fsSLO ${base}/checksums.txt.sig\ncurl -fsSLO ${base}/checksums.txt.pem\n\ncosign verify-blob checksums.txt \\\n  --signature checksums.txt.sig \\\n  --certificate checksums.txt.pem \\\n  --certificate-identity https://github.com/${release.repo}/.github/workflows/release.yml@refs/tags/${release.tag} \\\n  --certificate-oidc-issuer https://token.actions.githubusercontent.com\n\nsha256sum --check --ignore-missing checksums.txt\ngh attestation verify ${archive} --repo ${release.repo}`
}
