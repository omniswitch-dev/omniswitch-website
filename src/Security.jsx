import React from 'react';

export default function Security() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="section-badge">Security</div>
        <h1>Security policy</h1>
        <p>Summary of SECURITY.md. Read the full policy in the repository for the current, authoritative version.</p>
      </div>

      <div className="page-section">
        <h2>Supported versions</h2>
        <table className="comparison-table" style={{ width: '100%' }}>
          <thead><tr><th>Version</th><th>Supported</th></tr></thead>
          <tbody>
            <tr><td>0.2.x (beta)</td><td>Yes, full support</td></tr>
            <tr><td>0.1.0</td><td>Critical fixes only</td></tr>
            <tr><td>main (unreleased)</td><td>Best effort</td></tr>
            <tr><td>Anything older</td><td>No</td></tr>
          </tbody>
        </table>
      </div>

      <div className="page-section">
        <h2>Report a vulnerability privately</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Do not open a public issue for suspected vulnerabilities. Use{' '}
          <a href="https://github.com/omniswitch-dev/omniswitch/security/advisories/new" target="_blank" rel="noreferrer">
            GitHub private vulnerability reporting
          </a>{' '}
          on the repository (Security tab → &ldquo;Report a vulnerability&rdquo;). If that is unavailable to you, email{' '}
          <code>security@omniswitch.dev</code>.
        </p>
      </div>

      <div className="page-section">
        <h2>Response SLAs during the beta</h2>
        <table className="comparison-table" style={{ width: '100%' }}>
          <thead><tr><th>Milestone</th><th>Target</th></tr></thead>
          <tbody>
            <tr><td>Acknowledgment</td><td>Within 3 business days</td></tr>
            <tr><td>Triage and severity assessment</td><td>Within 7 days</td></tr>
            <tr><td>Fix target — high/critical</td><td>Within 30 days</td></tr>
            <tr><td>Fix target — medium/low</td><td>Best effort, scheduled into a normal release</td></tr>
          </tbody>
        </table>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.8rem' }}>
          We practice coordinated disclosure: we work with reporters on a disclosure timeline and credit them in the
          advisory and release notes unless they prefer to stay anonymous.
        </p>
      </div>

      <div className="page-section">
        <h2>Out of scope</h2>
        <ul className="docs-list">
          <li>Running with <code>auth: false</code> — documented as development-only.</li>
          <li>Setting <code>cache_scope: global</code> — intentionally shares cache entries across tenants; only appropriate for single-tenant deployments.</li>
          <li>Setting <code>log_payloads: true</code> — an explicit opt-in for debugging that logs request/response bodies.</li>
          <li>Reports that require an attacker to already have file-system or process access to the host.</li>
        </ul>
      </div>

      <div className="page-section">
        <h2>Hardening guidance</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Before running OmniSwitch against production traffic, read the production notes in{' '}
          <a href="https://github.com/omniswitch-dev/omniswitch/blob/main/docs/DEPLOYMENT.md" target="_blank" rel="noreferrer">docs/DEPLOYMENT.md</a>.
        </p>
      </div>

      <div className="page-section" style={{ textAlign: 'center' }}>
        <a className="btn-secondary" href="https://github.com/omniswitch-dev/omniswitch/blob/main/SECURITY.md" target="_blank" rel="noreferrer">
          Read the full SECURITY.md
        </a>
      </div>
    </div>
  );
}
