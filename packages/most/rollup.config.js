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
    '@most/core',
    '@most/scheduler',
    '@most/disposable',
    '@most/prelude'
  ],
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'most',
      sourcemap: true,
      globals: {
        '@most/core': 'mostCore',
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
