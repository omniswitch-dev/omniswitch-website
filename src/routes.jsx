import Home from './pages/Home.jsx'
import Quickstart from './pages/Quickstart.jsx'
import Install from './pages/Install.jsx'
import Docs from './pages/Docs.jsx'
import ApiReference from './pages/ApiReference.jsx'
import Security from './pages/Security.jsx'
import Community from './pages/Community.jsx'
import Roadmap from './pages/Roadmap.jsx'
import Changelog from './pages/Changelog.jsx'
import Benchmarks from './pages/Benchmarks.jsx'
import About from './pages/About.jsx'
import Compare from './pages/Compare.jsx'
import ComparePage from './pages/ComparePage.jsx'
import NotFound from './pages/NotFound.jsx'
import {
  competitors,
  latestReview,
  matrix,
  hubColumns,
  capabilityGroups,
} from './data/comparison.js'

const updated = '2026-10-09'
const route = (path, component, label, title, description, extras = {}) => ({
  path,
  component,
  label,
  title,
  description,
  updated,
  ogImage: `/og/${path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')}.png`,
  ...extras,
})

export const routes = [
  route(
    '/',
    Home,
    'Home',
    'OmniSwitch — every model, one switch, your rules',
    'Route models, guard your data, and govern your agents with OmniSwitch. One open-source, self-hosted AI gateway puts your traffic under your control.',
    { socialTitle: 'Every model. One switch. Your rules.', updated: '2026-10-29' },
  ),
  route(
    '/quickstart',
    Quickstart,
    'Quickstart',
    'Quickstart — run your first governed AI request | OmniSwitch',
    'Build an auth-enabled OmniSwitch gateway, connect an OpenAI-compatible client, and verify one governed request with the pinned pre-release quickstart.',
  ),
  route(
    '/install',
    Install,
    'Install',
    'Install — binary, Docker, and Kubernetes | OmniSwitch',
    'Choose a self-hosted OmniSwitch install path. Use pinned source before v0.2.0 publication, then verify signed checksums and GitHub build provenance.',
  ),
  route(
    '/docs',
    Docs,
    'Documentation',
    'Documentation — understand your AI control plane | OmniSwitch',
    'Operate OmniSwitch with explicit security, routing, budget, and protocol boundaries. Find canonical configuration, API, observability, and deployment guides.',
  ),
  route(
    '/api',
    ApiReference,
    'API reference',
    'API reference — model, MCP, and A2A scope | OmniSwitch',
    'Inspect OmniSwitch model endpoints, gateway headers, health probes, and beta MCP and A2A scope. Compatibility is documented per endpoint, not assumed.',
  ),
  route(
    '/security',
    Security,
    'Security',
    'Security — hardening and private disclosure | OmniSwitch',
    'Harden your self-hosted OmniSwitch gateway, review beta security boundaries and support targets, and report vulnerabilities through a private disclosure path.',
  ),
  route(
    '/community',
    Community,
    'Community',
    'Community — build the self-hosted control layer | OmniSwitch',
    'Contribute focused tests, reproducible feedback, and documentation to OmniSwitch. Discuss self-hosted AI operations and keep security reports private.',
  ),
  route(
    '/roadmap',
    Roadmap,
    'Roadmap',
    'Roadmap — implemented, unreleased, and deferred | OmniSwitch',
    'See what the pinned OmniSwitch register verifies, what is in the v0.2.0 release work, and which identity, cache, and agent capabilities remain deferred.',
  ),
  route(
    '/changelog',
    Changelog,
    'Changelog',
    'Changelog — review the v0.2.0 release scope | OmniSwitch',
    'Follow OmniSwitch changes across self-hosted control, gateway APIs, and agent governance. Unreleased v0.2.0 scope stays separate from published artifacts.',
  ),
  route(
    '/benchmarks',
    Benchmarks,
    'Benchmarks',
    'Benchmarks — pending results, reproducible methods | OmniSwitch',
    'OmniSwitch cross-gateway performance results are pending. Review frozen methodology, existing component benchmarks, their environment, and limitations.',
  ),
  route(
    '/about',
    About,
    'About',
    'About — AI infrastructure under your control | OmniSwitch',
    'Learn why OmniSwitch leads with self-hosted control, supports universal AI routing, and extends into governed agent infrastructure as an Apache-2.0 project.',
  ),
  route(
    '/compare',
    Compare,
    'Compare',
    'Compare AI gateways — architecture and evidence | OmniSwitch',
    'Compare OmniSwitch, LiteLLM, Portkey, Helicone, Kong, Cloudflare, and Agent Router using a dated capability register, edition scope, sources, and fit guidance.',
    {
      updated: latestReview(
        matrix.hub_rows,
        hubColumns.map((c) => c.id),
      ),
      socialTitle: 'Choose for your architecture. Not a checklist.',
    },
  ),
  ...competitors.map((competitor) =>
    route(
      `/compare/${competitor.slug}`,
      ComparePage,
      competitor.name,
      `OmniSwitch vs ${competitor.name} — self-hosted AI comparison`,
      `Compare OmniSwitch and ${competitor.name}: self-hosted control, AI routing, agent scope, edition boundaries, and dated capability sources.`,
      {
        props: { slug: competitor.slug },
        updated: latestReview(
          capabilityGroups().flatMap((g) => g.capabilities),
          ['omniswitch', competitor.primary, ...competitor.editions.map((e) => e.id)],
        ),
      },
    ),
  ),
]

export const notFoundRoute = route(
  '/404',
  NotFound,
  'Page not found',
  'Page not found — OmniSwitch',
  'This OmniSwitch page does not exist. Return to the self-hosted gateway overview, compare architectures, or find the current documentation.',
  { robots: 'noindex,follow' },
)

export function normalizePath(url) {
  const path = url.split(/[?#]/)[0] || '/'
  return path === '/' ? path : path.replace(/\/+$/, '')
}

export function findRoute(url) {
  return routes.find((r) => r.path === normalizePath(url)) || notFoundRoute
}
