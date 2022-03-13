import * as path from 'node:path'
import * as fs from 'node:fs/promises'
import parse from 'node-html-parser'

const root = process.cwd()
const dist = path.resolve(root, './dist')

export const startBuild = async () => {
  await fs.rm(dist, { recursive: true, force: true }).catch(() => {})
  await fs.mkdir(dist)

  const indexHtmlPath = path.resolve(root, './index.html')
  const distIndexHtmlPath = path.resolve(dist, './index.html')
  await processHtml(indexHtmlPath, distIndexHtmlPath, async src => {
    // dummy
    return src + '?processed'
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
