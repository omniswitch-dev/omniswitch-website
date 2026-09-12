import React from 'react';
import { GitBranch, MessageSquare, Bug, Users } from 'lucide-react';

export default function Community({ navigate }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="section-badge">Community</div>
        <h1>Help us finish the beta</h1>
        <p>The public beta runs a few weeks. Here is where the conversation happens and what we need most.</p>
      </div>

      <div className="community-grid">
        <div className="community-card">
          <h3><MessageSquare size={18} /> GitHub Discussions</h3>
          <p>Announcements, Q&amp;A, Ideas, Show and tell, and Beta feedback categories. Design proposals and the weekly
          changelog live here.</p>
          <a className="link" href="https://github.com/omniswitch-dev/omniswitch/discussions" target="_blank" rel="noreferrer">Join the discussion →</a>
        </div>
        <div className="community-card">
          <h3><Bug size={18} /> Issues</h3>
          <p>Bug reports and feature requests, with templates for each. Issues labelled <code>good-first-issue</code> are
          scoped for a first PR; maintainers aim to review within two business days.</p>
          <a className="link" href="https://github.com/omniswitch-dev/omniswitch/issues" target="_blank" rel="noreferrer">Open an issue →</a>
        </div>
        <div className="community-card">
          <h3><GitBranch size={18} /> Beta feedback form</h3>
          <p>Tell us your install method, OS/arch, <code>omniswitch version</code> output, what you tried, what
          happened, and minutes to first success. This is the highest-leverage thing you can send us right now.</p>
          <a className="link" href="https://github.com/omniswitch-dev/omniswitch/issues/new?template=beta-feedback.yml" target="_blank" rel="noreferrer">Submit beta feedback →</a>
        </div>
        <div className="community-card">
          <h3><Users size={18} /> Office hours</h3>
          <p>Weekly office hours during the beta window for install issues, config questions, and roadmap input.
          Schedule and call link are posted in Discussions each week — no slot is live yet.</p>
          <a className="link" href="https://github.com/omniswitch-dev/omniswitch/discussions" target="_blank" rel="noreferrer">Watch for the schedule →</a>
        </div>
        <div className="community-card">
          <h3>Security reports</h3>
          <p>Security reports go through private vulnerability reporting or <code>security@omniswitch.dev</code>, not
          public issues or Discussions.</p>
          <a className="link" href="/security" onClick={(e) => { e.preventDefault(); navigate('security'); }}>Read the security policy →</a>
        </div>
        <div className="community-card">
          <h3>Contributing</h3>
          <p>DCO sign-off (<code>git commit -s</code>), lazy consensus on PRs, and how to add a provider adapter are in
          CONTRIBUTING.md.</p>
          <a className="link" href="https://github.com/omniswitch-dev/omniswitch/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer">Read CONTRIBUTING.md →</a>
        </div>
      </div>
    </div>
  );
}
