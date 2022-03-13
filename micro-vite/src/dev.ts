import connect from 'connect'
import historyApiFallback from 'connect-history-api-fallback'
import sirv from 'sirv'
import { createFileWatcher } from './fileWatcher'
import { createPluginContainer } from './pluginContainer'
import { getPlugins } from './plugins'
import { setupReloadServer as setupWsServer } from './reloadPlugin'
import { transformMiddleware } from './transformMiddleware'

export const startDev = () => {
  const server = connect()
  server.listen(3000, 'localhost')
  const ws = setupWsServer()

  const plugins = getPlugins()
  const pluginContainer = createPluginContainer(plugins)

  server.use(transformMiddleware(pluginContainer))
  server.use(
    sirv(undefined, {
      dev: true,
      etag: true,
      setHeaders(res, pathname) {
        // .js, .ts should be application/javascript
        if (/\.[tj]s$/.test(pathname)) {
          res.setHeader('Content-Type', 'application/javascript')
        }
      }
    })
  )
  server.use(historyApiFallback() as any)

  console.log('dev server running at http://localhost:3000')

  createFileWatcher((eventName, path) => {
    console.log(`Detected file change (${eventName}) reloading!: ${path}`)
    ws.send({ type: 'reload' })
  })
}
