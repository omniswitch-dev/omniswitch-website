import { useContext, useRef } from 'react'
import { Shield, ArrowRight, Menu, GitFork } from 'lucide-react'
import Link from './Link.jsx'
import { Button } from './UI.jsx'
import { NavigationContext } from './navigation.js'
import './Layout.css'

const nav = [
  ['Product', '/#control', 'product'],
  ['Security', '/security', 'security'],
  ['Compare', '/compare', 'compare'],
  ['Docs', '/docs', 'docs'],
  ['Community', '/community', 'community'],
]
const footer = [
  [
    'Product',
    [
      ['Gateway', '/#routing', 'gateway'],
      ['Security', '/security', 'security'],
      ['Agent protocols', '/#agents', 'agents'],
      ['Compare', '/compare', 'compare'],
    ],
  ],
  [
    'Developers',
    [
      ['Quickstart', '/quickstart', 'quickstart'],
      ['Documentation', '/docs', 'docs'],
      ['API reference', '/api', 'api'],
      ['Install', '/install', 'install'],
    ],
  ],
  [
    'Open source',
    [
      ['Community', '/community', 'community'],
      ['Changelog', '/changelog', 'changelog'],
      ['Roadmap', '/roadmap', 'roadmap'],
      ['About', '/about', 'about'],
    ],
  ],
]

function Brand({ id }) {
  return (
    <Link href="/" className="brand" aria-label="OmniSwitch home" data-component-id={id}>
      <Shield className="icon" aria-hidden="true" />
      OmniSwitch
    </Link>
  )
}

export default function Layout({ children }) {
  const { path } = useContext(NavigationContext)
  const menu = useRef(null)
  const current = (href) => (href === '/compare' ? path.startsWith(href) : path === href)
  function closeMenu(event) {
    if (event.target.closest('a')) menu.current.open = false
  }
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="announcement">
        <strong>
          <span className="dot" />
          Public beta
        </strong>
        <span className="desktop-announcement">Open source. Built in the open.</span>
        <Link href="/#beta" data-component-id="announcement-beta">
          Explore the beta
          <ArrowRight className="icon" aria-hidden="true" />
        </Link>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand id="header-brand" />
          <nav className="nav" aria-label="Main navigation">
            {nav.map(([name, href, id]) => (
              <Link
                key={id}
                href={href}
                className={current(href) ? 'selected' : undefined}
                aria-current={current(href) ? 'page' : undefined}
                data-component-id={`nav-${id}`}
              >
                {name}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <Link href="/quickstart" data-component-id="nav-quickstart">
              Quickstart
            </Link>
            <Button href="/quickstart" small arrow data-component-id="nav-get-started">
              Get started
            </Button>
          </div>
          <details className="mobile-navigation" ref={menu}>
            <summary aria-label="Toggle navigation" data-component-id="mobile-navigation-toggle">
              <Menu className="icon" aria-hidden="true" />
            </summary>
            <nav aria-label="Mobile navigation" onClick={closeMenu}>
              {nav.map(([name, href, id]) => (
                <Link key={id} href={href}>
                  {name}
                </Link>
              ))}
              <Link href="/quickstart">Quickstart</Link>
              <Link href="/install">Install options</Link>
            </nav>
          </details>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer" id="footer-nav">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <Brand id="footer-brand" />
              <p>AI infrastructure. Under your control.</p>
              <a className="github-link" href="https://github.com/omniswitch-dev/omniswitch">
                <GitFork className="icon" aria-hidden="true" />
                Build with us on GitHub
              </a>
            </div>
            <nav className="footer-links" aria-label="Footer navigation">
              {footer.map(([title, links]) => (
                <div key={title}>
                  <strong>{title.toUpperCase()}</strong>
                  {links.map(([name, href, id]) => (
                    <Link href={href} key={id} data-component-id={`footer-${id}`}>
                      {name}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
          <div className="footer-bottom">
            <span>© 2026 OmniSwitch · Apache-2.0</span>
            <Link href="/benchmarks">Self-hosted. Open source. Public beta.</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
