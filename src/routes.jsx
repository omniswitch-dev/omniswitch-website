import Home from './pages/Home.jsx'
import Quickstart from './pages/Quickstart.jsx'
import Docs from './pages/Docs.jsx'
import ApiReference from './pages/ApiReference.jsx'
import Security from './pages/Security.jsx'
import NotFound from './pages/NotFound.jsx'

const route = (path, component, label, title, description, extras = {}) => ({
  path,
  component,
  label,
  title,
  description,
  updated: '2026-10-29',
  ogImage: `/og/${path === '/' ? 'home' : path.slice(1)}.png`,
  ...extras,
})

export const routes = [
  route(
    '/',
    Home,
    'Home',
    'OmniSwitch — self-hosted AI gateway for models and tools',
    'Route LLM requests, apply guardrails, and connect MCP tools through one open-source, self-hosted AI gateway with logs, budgets, and policy controls.',
    { socialTitle: 'One gateway for models and tools.' },
  ),
  route(
    '/quickstart',
    Quickstart,
    'Quickstart',
    'Quickstart | OmniSwitch',
    'Build OmniSwitch from source, configure a provider, and send your first request through an authenticated local AI gateway.',
  ),
  route(
    '/docs',
    Docs,
    'Documentation',
    'Documentation | OmniSwitch',
    'Find configuration, routing, MCP, observability, and deployment guides for the self-hosted OmniSwitch AI gateway.',
  ),
  route(
    '/api',
    ApiReference,
    'API reference',
    'API reference | OmniSwitch',
    'Explore OmniSwitch model endpoints, MCP tools, A2A discovery, gateway headers, and operational endpoints. Find the complete API documentation.',
  ),
  route(
    '/security',
    Security,
    'Security',
    'Security | OmniSwitch',
    'Configure gateway authentication, protect provider credentials, and report vulnerabilities through the OmniSwitch private disclosure process.',
  ),
]

export const notFoundRoute = route(
  '/404',
  NotFound,
  'Page not found',
  'Page not found | OmniSwitch',
  'This OmniSwitch page could not be found. Return to the gateway overview, follow the quickstart, or browse the documentation.',
  { robots: 'noindex,follow' },
)

export function normalizePath(url) {
  const path = url.split(/[?#]/)[0] || '/'
  return path === '/' ? path : path.replace(/\/+$/, '')
}
export function findRoute(url) {
  return routes.find((r) => r.path === normalizePath(url)) || notFoundRoute
}
