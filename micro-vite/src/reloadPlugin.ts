import type { Plugin } from 'rollup'
import { parse } from 'node-html-parser'

const virtualScriptId = '/@micro-vite:reload/script.js'
const virtualScript = `
  console.log('bar')
`

export const reload = (): Plugin => {
  return {
    name: 'micro-vite:reload',
    async resolveId(id: string) {
      if (id === virtualScriptId) return virtualScriptId
      return null
    },
    async load(id: string) {
      if (id === virtualScriptId) {
        return virtualScript
      }
      return null
    },
    async transform(code, id) {
      if (!id.endsWith('.html')) return null

      const doc = parse(code)
      doc
        .querySelector('head')
        ?.insertAdjacentHTML('beforeend', `<script type="module" src="${virtualScriptId}">`)

      return doc.toString()
    }
  }
}
