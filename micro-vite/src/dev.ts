import connect from 'connect'
import historyApiFallback from 'connect-history-api-fallback'
import sirv from 'sirv'

export const startDev = () => {
  const server = connect()
  server.listen(3000, 'localhost')

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
}
