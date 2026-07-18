import React from 'react';
import { Server, Code, Play } from 'lucide-react';
import './index.css';

export default function ApiReference() {
  return (
    <div className="api-container">
      <div className="api-header">
        <h1>API Reference</h1>
        <p>OmniSwitch provides a unified API that is 100% compatible with the OpenAI specification.</p>
      </div>

      <div className="api-endpoints">
        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method post">POST</span>
            <span className="path">/v1/chat/completions</span>
          </div>
          <p className="endpoint-desc">Creates a model response for the given chat conversation.</p>
          
          <h4>Headers</h4>
          <ul className="api-list">
            <li><code>Authorization: Bearer &lt;token&gt;</code> <span className="optional">(Required if auth enabled)</span></li>
            <li><code>x-omniswitch-provider: &lt;provider_name&gt;</code> <span className="optional">(Optional)</span></li>
            <li><code>x-omniswitch-trace-id: &lt;string&gt;</code> <span className="optional">(Optional)</span></li>
            <li><code>x-omniswitch-session-id: &lt;string&gt;</code> <span className="optional">(Optional)</span></li>
          </ul>

          <h4>Example Request</h4>
          <div className="code-block api-code">
            <pre><code>{`curl http://localhost:8080/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'`}</code></pre>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method get">GET</span>
            <span className="path">/api/metrics</span>
          </div>
          <p className="endpoint-desc">Retrieves aggregated usage metrics and statistics for the gateway.</p>
          
          <h4>Query Parameters</h4>
          <ul className="api-list">
            <li><code>window</code> - Time window (e.g. <code>24h</code>, <code>7d</code>). Default: <code>24h</code></li>
          </ul>

          <h4>Example Response</h4>
          <div className="code-block api-code">
            <pre><code>{`{
  "total_requests": 1425,
  "allowed_count": 1400,
  "denied_count": 25,
  "avg_latency_ms": 342,
  "total_cost": 0.0452,
  "total_tokens": 125000,
  "cache_hits": 850
}`}</code></pre>
          </div>
        </div>
        
        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method post">POST</span>
            <span className="path">/api/keys</span>
          </div>
          <p className="endpoint-desc">Generates a new virtual API key for the gateway.</p>
          
          <h4>Body</h4>
          <ul className="api-list">
            <li><code>name</code> (string) - Name of the application or agent.</li>
            <li><code>rate_limit</code> (integer) - Maximum requests per minute.</li>
          </ul>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method post">POST</span>
            <span className="path">/v1/rerank</span>
          </div>
          <p className="endpoint-desc">Provider-neutral rerank endpoint for RAG retrieval stacks. Reuses gateway auth, budgets, guardrails, and logging.</p>
          
          <h4>Body</h4>
          <ul className="api-list">
            <li><code>model</code> (string) - Rerank model (e.g. <code>rerank-v3.5</code>).</li>
            <li><code>query</code> (string) - The search query to rank against.</li>
            <li><code>documents</code> (array) - List of documents (strings or objects) to rerank.</li>
          </ul>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method post">POST</span>
            <span className="path">/v1/moderations</span>
          </div>
          <p className="endpoint-desc">OpenAI-compatible local moderation endpoint. Runs OmniSwitch guardrails locally without sending data to any external moderation API.</p>
          
          <h4>Body</h4>
          <ul className="api-list">
            <li><code>input</code> (string | string[]) - Text(s) to evaluate for content policy violations.</li>
            <li><code>model</code> (string, optional) - Model identifier (defaults to <code>omniswitch-guardrails</code>).</li>
          </ul>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method post">POST</span>
            <span className="path">/a2a</span>
          </div>
          <p className="endpoint-desc">Agent-to-Agent v1 JSON-RPC endpoint. Supports <code>SendMessage</code> and <code>GetExtendedAgentCard</code> methods. Inference is routed through the full gateway pipeline.</p>
          
          <h4>Discovery</h4>
          <ul className="api-list">
            <li><code>GET /.well-known/agent.json</code> - Returns the A2A Agent Card with skills, capabilities, and security schemes.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
