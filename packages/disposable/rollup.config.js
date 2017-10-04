import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  plugins: [
    buble()
  ],
  external: [
    '@most/prelude'
  ],
  targets: [
    {
      dest: 'dist/index.js',
      format: 'umd',
      moduleName: 'mostDisposable',
      sourceMap: true,
      globals: {
        '@most/prelude': 'mostPrelude'
      }
    },
    {
      dest: 'dist/index.es.js',
      format: 'es',
      sourceMap: true
    }
  ]
}
