import { resolve } from './resolvePlugin'
import { reload } from './reloadPlugin'
import esbuild from 'rollup-plugin-esbuild'

export const getPlugins = () => [
  resolve(),
  reload(),
  esbuild({
    target: 'esnext',
    minify: false
  })
]
