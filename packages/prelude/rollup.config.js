import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  dest: 'dist/prelude.js',
  format: 'umd',
  moduleName: 'mostPrelude',
  sourceMap: true,
  plugins: [
    buble()
  ]
}
