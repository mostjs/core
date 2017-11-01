import buble from 'rollup-plugin-buble'
import pkg from './package.json'

export default {
  input: 'src/index.js',
  plugins: [
    buble()
  ],
  external: [
    '@most/prelude'
  ],
  targets: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'mostCore',
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
