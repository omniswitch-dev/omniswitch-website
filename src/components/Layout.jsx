import { useContext, useRef } from 'react'
import { Menu, GitFork } from 'lucide-react'
import Link from './Link.jsx'
import { Button } from './UI.jsx'
import { NavigationContext } from './navigation.js'
import { repoUrl } from '../data/product.js'
import './Layout.css'

const nav = [
  ['Product', '/#control', 'product'],
  ['Docs', '/docs', 'docs'],
]
const footer = [
  ['Quickstart', '/quickstart'],
  ['Documentation', '/docs'],
  ['API reference', '/api'],
  ['Security', '/security'],
]
function Brand({ id }) {
  return (
    <Link href="/" className="brand" aria-label="OmniSwitch home" data-component-id={id}>
      <img src="/brand/omniswitch-mark.svg" width="28" height="30" alt="" />
      <span>OmniSwitch</span>
    </Link>
  )
}
export default function Layout({ children }) {
  const { path } = useContext(NavigationContext)
  const menu = useRef(null)
  function closeMenu(event) {
    if (event.target.closest('a')) menu.current.open = false
  }
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Brand id="header-brand" />
          <nav className="nav" aria-label="Main navigation">
            {nav.map(([name, href, id]) => (
              <Link
                key={id}
                href={href}
                aria-current={path === href ? 'page' : undefined}
                className={path === href ? 'selected' : undefined}
              >
                {name}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <Link href={repoUrl} className="header-github">
              <GitFork className="icon" aria-hidden="true" />
              GitHub
            </Link>
            <Button href="/quickstart" small arrow>
              Get started
            </Button>
          </div>
          <details className="mobile-navigation" ref={menu}>
            <summary aria-label="Toggle navigation">
              <Menu className="icon" aria-hidden="true" />
            </summary>
            <nav aria-label="Mobile navigation" onClick={closeMenu}>
              {nav.map(([name, href, id]) => (
                <Link key={id} href={href}>
                  {name}
                </Link>
              ))}
              <Link href="/quickstart">Quickstart</Link>
              <Link href="/api">API reference</Link>
              <Link href={repoUrl}>GitHub</Link>
            </nav>
          </details>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <Brand id="footer-brand" />
              <p>Self-hosted AI gateway for models and tools.</p>
            </div>
            <nav className="footer-links" aria-label="Footer navigation">
              {footer.map(([name, href]) => (
                <Link key={href} href={href}>
                  {name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="footer-bottom">
            <span>© 2026 OmniSwitch · Apache-2.0</span>
            <a href={repoUrl}>Open source on GitHub ↗</a>
          </div>
        </div>
      </footer>
    </>
  )
}
