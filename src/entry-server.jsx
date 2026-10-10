import { prerender } from 'react-dom/static'
import App from './App.jsx'
import { routes, notFoundRoute, findRoute } from './routes.jsx'
import { renderHead } from './seo.js'

export { routes, notFoundRoute }

export async function render(path) {
  const route = findRoute(path)
  const { prelude } = await prerender(<App url={path} />, {
    onError(error) {
      throw error
    },
  })
  return { html: await new Response(prelude).text(), head: renderHead(route), route }
}
