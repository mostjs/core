import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  plugins: [
    typescript({
      tsconfig: './src/tsconfig.json',
      typescript: require('typescript'),
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
