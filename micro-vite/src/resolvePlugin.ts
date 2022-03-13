import type { Plugin } from 'rollup'
import * as path from 'node:path'
import * as fs from 'node:fs/promises'

const root = process.cwd()

const extensions = ['', '.ts', '.js']

const fileExists = async (p: string) => {
  try {
    const stat = await fs.stat(p)
    if (stat.isFile()) {
      return true
    }
  } catch {}
  return false
}

export const resolve = (): Plugin => {
  return {
    name: 'micro-vite:resolve',
    async resolveId(id: string) {
      for (const ext of extensions) {
        const absolutePath = path.resolve(root, `.${id}${ext}`)
        if (await fileExists(absolutePath)) {
          return absolutePath
        }
      }

      if (id.endsWith('/')) {
        const absolutePath = path.resolve(root, `.${id}index.html`)
        if (await fileExists(absolutePath)) {
          return absolutePath
        }
      }

      return null
    },
    async load(id: string) {
      try {
        const res = await fs.readFile(id, 'utf-8')
        return res
      } catch {}
      return null
    }
  }
}
