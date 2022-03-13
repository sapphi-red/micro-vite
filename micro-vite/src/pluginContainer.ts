import type { Plugin, LoadResult, PartialResolvedId, SourceDescription } from 'rollup'

export type PluginContainer = {
  resolveId(id: string): Promise<PartialResolvedId | null>
  load(id: string): Promise<LoadResult | null>
  transform(code: string, id: string): Promise<SourceDescription | null>
}

export const createPluginContainer = (plugins: Plugin[]): PluginContainer => {
  return {
    async resolveId(id) {
      for (const plugin of plugins) {
        if (plugin.resolveId) {
          // @ts-expect-error do not support rollup context
          const newId = await plugin.resolveId(id, undefined, undefined)
          if (newId) {
            id = typeof newId === 'string' ? newId : newId.id
            return { id }
          }
        }
      }
      return null
    },
    async load(id) {
      for (const plugin of plugins) {
        if (plugin.load) {
          // @ts-expect-error do not support rollup context
          const result = await plugin.load(id)
          if (result) {
            return result
          }
        }
      }
      return null
    },
    async transform(code, id) {
      for (const plugin of plugins) {
        if (plugin.transform) {
          // @ts-expect-error do not support rollup context
          const result = await plugin.transform(code, id)
          if (!result) continue
          if (typeof result === 'string') {
            code = result
          } else if (result.code) {
            code = result.code
          }
        }
      }
      return { code }
    }
  }
}
