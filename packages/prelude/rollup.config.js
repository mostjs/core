import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  plugins: [
    buble()
  ],
  targets: [
    {
      dest: 'dist/index.js',
      format: 'umd',
      moduleName: 'mostPrelude',
      sourceMap: true
    },
    {
      dest: 'dist/index.es.js',
      format: 'es',
      sourceMap: true
    }
  ]
}
