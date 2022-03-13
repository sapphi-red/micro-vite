import { NextHandleFunction } from 'connect'
import { PluginContainer } from './pluginContainer'

export const transformMiddleware = (pluginContainer: PluginContainer): NextHandleFunction => {
  const transformRequest = async (pathname: string): Promise<{ mime?: string, content: string } | null> => {
    const idResult = await pluginContainer.resolveId(pathname) || { id: pathname }

    const loadResult = await pluginContainer.load(idResult.id)
    if (!loadResult) {
      return null
    }

    const code = typeof loadResult === 'string' ? loadResult : loadResult.code
    const transformResult = await pluginContainer.transform(code, idResult.id)
    if (!transformResult) {
      return null
    }

    return {
      mime: /\.[jt]s$/.test(idResult.id) ? 'application/javascript' : undefined,
      content: transformResult.code
    }
  }

  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next()
    }

    let url: URL
    try {
      url = new URL(req.url!, 'http://example.com')
    } catch (e) {
      return next(e)
    }

    const pathname = url.pathname

    try {
      const result = await transformRequest(pathname)
      if (result) {
        res.statusCode = 200
        if (result.mime) {
          res.setHeader('Content-Type', result.mime)
        }
        return res.end(result.content)
      }
    } catch (e) {
      return next(e)
    }

    next()
  }
}
