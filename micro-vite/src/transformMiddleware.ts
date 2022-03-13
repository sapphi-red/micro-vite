import { NextHandleFunction } from 'connect'

export const transformMiddleware = (): NextHandleFunction => {
  const transformRequest = async (pathname: string): Promise<{ mime: string, content: string } | null> => {
    // fake implementation
    if (pathname.endsWith('.ts')) {
      return {
        mime: 'application/javascript',
        content: `console.log('file: ${pathname}')`
      }
    }
    return null
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
        res.setHeader('Content-Type', result.mime)
        return res.end(result.content)
      }
    } catch (e) {
      return next(e)
    }

    next()
  }
}
