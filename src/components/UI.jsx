import { useState } from 'react'
import { ArrowRight, Copy, Terminal, GitBranch } from 'lucide-react'
import Link from './Link.jsx'
import { claimState } from '../data/claim-state.js'
import './UI.css'

export function Button({
  href,
  children,
  variant = 'secondary',
  small,
  arrow,
  className = '',
  ...props
}) {
  return (
    <Link
      href={href}
      className={`button ${variant} ${small ? 'small' : ''} ${className}`}
      {...props}
    >
      {children}
      {arrow && <ArrowRight className="icon" aria-hidden="true" />}
    </Link>
  )
}

export function TextLink({ href, children, ...props }) {
  return (
    <Link href={href} className="text-link" {...props}>
      {children}
      <ArrowRight className="icon" aria-hidden="true" />
    </Link>
  )
}

export function Card({ children, className = '', ...props }) {
  return (
    <article className={`card ${className}`} {...props}>
      {children}
    </article>
  )
}

export function Pill({ children = 'Beta', variant = 'beta' }) {
  return <span className={`pill ${variant}-pill`}>{children}</span>
}

export function Eyebrow({ children }) {
  return <div className="eyebrow">{children}</div>
}

export function SectionHeading({ eyebrow, title, children, id }) {
  return (
    <div className="section-heading">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id}>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  )
}

export function StateBadge({ claim, gateway, state }) {
  const { key, label } = state || claimState(claim, gateway)
  return (
    <span className={`state ${key}`}>
      <i aria-hidden="true" />
      {label}
    </span>
  )
}

export function CodePanel({ title, language, code, children, footer, copy = true }) {
  const [status, setStatus] = useState('')
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setStatus('Copied')
    } catch {
      setStatus('Copy unavailable; select the code below')
    }
  }
  return (
    <div className="code-panel" role="group" aria-label={title}>
      <div className="code-header">
        <span>
          <Terminal className="icon" aria-hidden="true" />
          {title}
        </span>
        <span className="code-tools">
          <span className="mono">{language}</span>
          {copy && (
            <button
              className="copy-button"
              type="button"
              onClick={copyCode}
              aria-label={`Copy ${title}`}
            >
              <Copy className="icon" aria-hidden="true" />
            </button>
          )}
        </span>
      </div>
      <pre>
        <code>{children || code}</code>
      </pre>
      {status && (
        <p className="copy-status" role="status">
          {status}
        </p>
      )}
      {footer && (
        <div className="code-footer">
          <GitBranch className="icon" aria-hidden="true" />
          {footer}
        </div>
      )}
    </div>
  )
}
