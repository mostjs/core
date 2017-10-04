import babel from 'rollup-plugin-babel'
import pkg from './package.json'

export default {
  input: 'src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    })
  ],
  external: [
    '@most/prelude'
  ],
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'mostDisposable',
      sourcemap: true,
      globals: {
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
