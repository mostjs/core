import typescript from 'rollup-plugin-typescript2'
import localResolve from 'rollup-plugin-local-resolve'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  plugins: [
    localResolve(),
    typescript({
      tsconfig: './src/tsconfig.json',
      typescript: require('typescript'),
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
