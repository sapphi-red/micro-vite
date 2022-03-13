import { resolve } from './resolvePlugin'
import esbuild from 'rollup-plugin-esbuild'

export const getPlugins = () => [
  resolve(),
  esbuild({
    target: 'esnext',
    minify: false
  })
]
