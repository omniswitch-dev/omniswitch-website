import { useCallback, useEffect, useRef, useState } from 'react'
import Layout from './components/Layout.jsx'
import { NavigationContext } from './components/navigation.js'
import { findRoute, normalizePath } from './routes.jsx'
import { applyMeta } from './seo.js'

export default function App({ url = '/' }) {
  const [currentUrl, setCurrentUrl] = useState(url)
  const previousUrl = useRef(url)
  const route = findRoute(currentUrl)
  const Page = route.component
  const navigate = useCallback((href) => {
    const target = new URL(href, window.location.href)
    const next = target.pathname + target.search + target.hash
    window.history.pushState({}, '', next)
    setCurrentUrl(next)
  }, [])

  useEffect(() => {
    const onPop = () =>
      setCurrentUrl(window.location.pathname + window.location.search + window.location.hash)
    window.addEventListener('popstate', onPop)
    document.documentElement.classList.add('js-enabled')
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    applyMeta(route)
    const changed = previousUrl.current !== currentUrl
    const hash = currentUrl.includes('#') ? currentUrl.slice(currentUrl.indexOf('#') + 1) : ''
    if (hash) {
      let id
      try {
        id = decodeURIComponent(hash)
      } catch {
        id = hash
      }
      document.getElementById(id)?.scrollIntoView()
    } else if (changed) {
      window.scrollTo(0, 0)
      document.querySelector('main h1')?.focus({ preventScroll: true })
    }
    previousUrl.current = currentUrl
  }, [currentUrl, route])

  return (
    <NavigationContext value={{ navigate, path: normalizePath(currentUrl) }}>
      <Layout>
        <Page {...route.props} />
      </Layout>
    </NavigationContext>
  )
}
