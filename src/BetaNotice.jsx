import React from 'react';

export function BetaBadge({ text }) {
  return <span className="pill pill-beta">{text || 'Public beta'}</span>;
}

export function KnownLimitations() {
  return (
    <div className="known-limitations">
      <h4><BetaBadge /> Known limitations</h4>
      <ul>
        <li>Control plane is single-replica: API keys, logs, and budgets live in SQLite on one instance. Redis only coordinates rate limits across replicas.</li>
        <li>Responses API and Anthropic Messages API are subsets — see docs/API.md for unsupported fields.</li>
        <li>A2A support covers Agent Card discovery and <code>SendMessage</code>; there is no task lifecycle, streaming, or push notifications yet.</li>
        <li>No mTLS, SAML, or SCIM. Identity today is API keys plus OIDC/JWKS and CEL authorization.</li>
        <li>Guardrail stream buffering defaults on and can delay first token when guardrails run on streamed output.</li>
        <li>Semantic cache is normalized token-frequency cosine similarity, not embeddings — thresholds behave differently than a vector cache.</li>
      </ul>
    </div>
  );
}
