import type { Plugin } from 'rollup'
import * as path from 'node:path'
import * as fs from 'node:fs/promises'

const root = process.cwd()

export const resolve = (): Plugin => {
  return {
    name: 'micro-vite:resolve',
    async resolveId(id: string) {
      const absolutePath = path.resolve(root, `.${id}`)
      try {
        const stat = await fs.stat(absolutePath)
        if (stat.isFile()) {
          return absolutePath
        }
      } catch {}
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
