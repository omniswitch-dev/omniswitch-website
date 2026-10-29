import Link from './Link.jsx'
import { Eyebrow, TextLink } from './UI.jsx'
import './PageShell.css'

export default function PageShell({
  eyebrow,
  title,
  lede,
  updated = '2026-10-29',
  children,
  toc,
  breadcrumbs,
}) {
  return (
    <div className="page-shell container">
      {breadcrumbs && (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">OmniSwitch</Link>
          {breadcrumbs.map(({ label, href }) => (
            <span key={label}>
              <span aria-hidden="true"> / </span>
              {href ? <Link href={href}>{label}</Link> : label}
            </span>
          ))}
        </nav>
      )}
      <header className="page-heading">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 tabIndex={-1}>{title}</h1>
        <p className="page-lede">{lede}</p>
        <p className="updated">
          Updated <time dateTime={updated}>{updated}</time> · Public beta
        </p>
      </header>
      <div className={toc ? 'docs-layout' : 'page-body'}>
        {toc && (
          <nav className="page-toc" aria-label="On this page">
            {toc.map(([id, label]) => (
              <Link key={id} href={`#${id}`}>
                {label}
              </Link>
            ))}
          </nav>
        )}
        <div className="prose">{children}</div>
      </div>
    </div>
  )
}

export function PageSection({ id, title, children }) {
  return (
    <section className="page-section" id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

export function NextSteps() {
  return (
    <div className="next-steps">
      <TextLink href="/quickstart">Quickstart</TextLink>
      <TextLink href="/docs">Documentation</TextLink>
      <TextLink href="/api">API reference</TextLink>
    </div>
  )
}
