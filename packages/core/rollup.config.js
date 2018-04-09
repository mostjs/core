import babel from 'rollup-plugin-babel'
import localResolve from 'rollup-plugin-local-resolve'
import pkg from './package.json'

export default {
  input: 'src/index.js',
  plugins: [
    localResolve(),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    })
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
      name: 'mostCore',
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
