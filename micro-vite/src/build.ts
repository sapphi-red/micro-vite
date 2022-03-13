import * as path from 'node:path'
import * as fs from 'node:fs/promises'
import parse from 'node-html-parser'
import { rollup } from 'rollup'
import { getPlugins } from './plugins'

const root = process.cwd()
const dist = path.resolve(root, './dist')

export const startBuild = async () => {
  const plugins = getPlugins(false)

  await fs.rm(dist, { recursive: true, force: true }).catch(() => {})
  await fs.mkdir(dist)

  const indexHtmlPath = path.resolve(root, './index.html')
  const distIndexHtmlPath = path.resolve(dist, './index.html')
  await processHtml(indexHtmlPath, distIndexHtmlPath, async src => {
    const bundle = await rollup({
      input: path.resolve(root, `.${src}`),
      plugins
    })
    const { output } = await bundle.write({
      dir: dist,
      format: 'es',
      entryFileNames: 'assets/[name].[hash].js',
      chunkFileNames: 'assets/[name].[hash].js'
    })
    await bundle.close()
    return `/${output[0].fileName}`
  })
}

const processHtml = async (
  htmlPath: string,
  distHtmlPath: string,
  bundleEntrypoint: (path: string) => Promise<string>
) => {
  const htmlContent = await fs.readFile(htmlPath, 'utf-8')
  const doc = parse(htmlContent)
  const scriptTag = doc.querySelector('script') // only expect one entrypoint
  if (scriptTag) {
    const src = scriptTag.getAttribute('src')
    if (src) {
      const newSrc = await bundleEntrypoint(src)
      scriptTag.setAttribute('src', newSrc)
    }
  }
  await fs.writeFile(distHtmlPath, doc.toString(), 'utf-8')
}
