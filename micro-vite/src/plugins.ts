import { resolve } from './resolvePlugin'
import { reload } from './reloadPlugin'
import esbuild from 'rollup-plugin-esbuild'

export const getPlugins = (isDev: boolean) => [
  ...(isDev ? [resolve(), reload()] : []),
  esbuild({
    target: isDev ? 'esnext' : 'es2019',
    minify: !isDev
  })
]
