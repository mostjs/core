// import typescript from '@rollup/plugin-typescript'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import pkg from './package.json' assert { type: 'json' }

export default {
  input: 'src/index.ts',
  plugins: [
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.node']
    }),
    typescript()
  ],
  external: [
    '@most/scheduler',
    '@most/disposable',
    '@most/prelude'
  ],
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'mostCoreFl',
      sourcemap: true,
      globals: {
        '@most/scheduler': 'mostScheduler',
        '@most/disposable': 'mostDisposable',
        '@most/prelude': 'mostPrelude'
      }
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ]
}
