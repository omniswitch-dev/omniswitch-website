import React from 'react';
import { BetaBadge } from './BetaNotice';

export default function Install() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="section-badge"><BetaBadge /> Install</div>
        <h1>Every install method, verify, upgrade, uninstall</h1>
        <p>Pick one. All methods run the same gateway binary and speak the same OpenAI-compatible API on port 8080.</p>
      </div>

      <div className="page-section">
        <h2>Binary (Linux, macOS)</h2>
        <div className="code-block">
          <div className="code-header">Install</div>
          <pre><code>{'curl -fsSL https://raw.githubusercontent.com/omniswitch-dev/omniswitch/main/install.sh | sh'}</code></pre>
        </div>
        <div className="code-block" style={{ marginTop: '1rem' }}>
          <div className="code-header">Run</div>
          <pre><code>{'OPENAI_API_KEY=sk-... omniswitch serve'}</code></pre>
        </div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '0.6rem' }}>
          Set <code>OMNISWITCH_VERSION</code> before piping the script to install a specific tag, including prereleases
          (e.g. <code>OMNISWITCH_VERSION=v0.2.0-beta.1</code>).
        </p>
      </div>

      <div className="page-section">
        <h2>Docker</h2>
        <div className="code-block">
          <div className="code-header">Run</div>
          <pre><code>{'docker run -p 8080:8080 -e OPENAI_API_KEY=sk-... ghcr.io/omniswitch-dev/omniswitch:0.2.0-beta.1'}</code></pre>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.6rem' }}>
          Prefer Compose? Clone the repository and run <code>docker compose up -d</code>.
        </p>
      </div>

      <div className="page-section">
        <h2>Homebrew (macOS / Linuxbrew)</h2>
        <div className="code-block">
          <div className="code-header">Install</div>
          <pre><code>{'brew install omniswitch-dev/tap/omniswitch'}</code></pre>
        </div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '0.6rem' }}>
          The tap tracks stable releases. Beta builds are installable via a direct formula URL or
          <code> brew install --HEAD</code> until a beta formula ships.
        </p>
      </div>

      <div className="page-section">
        <h2>Kubernetes</h2>
        <div className="code-block">
          <div className="code-header">Kustomize</div>
          <pre><code>{'kubectl apply -k deploy/kubernetes'}</code></pre>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.6rem' }}>
          Replace the example secrets in <code>deploy/kubernetes/secret.example.yaml</code> before using the manifests
          outside a throwaway environment. A Helm chart also ships under <code>deploy/helm</code>.
        </p>
      </div>

      <div className="page-section">
        <h2>Verify</h2>
        <div className="code-block">
          <div className="code-header">Version and health</div>
          <pre><code>{`omniswitch version
curl http://localhost:8080/healthz`}</code></pre>
        </div>
      </div>

      <div className="page-section">
        <h2>Upgrade</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Binary: re-run the install script (it overwrites the previous binary). Docker: pull the new tag and restart the
          container. Homebrew: <code>brew upgrade omniswitch</code>. Kubernetes: bump the image tag in your overlay and
          re-apply. Config files use <code>apiVersion: omniswitch.dev/v1</code>, which stays additive during the beta.
        </p>
      </div>

      <div className="page-section">
        <h2>Uninstall</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Binary: delete the installed executable (<code>rm</code> — no other files are written outside your working
          directory unless you pointed <code>gateway.storage</code> elsewhere). Docker: <code>docker rm</code> the
          container and remove the image. Homebrew: <code>brew uninstall omniswitch</code>. Kubernetes:{' '}
          <code>kubectl delete -k deploy/kubernetes</code>.
        </p>
      </div>
    </div>
  );
}
