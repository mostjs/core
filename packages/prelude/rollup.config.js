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
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'mostPrelude',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ]
}
