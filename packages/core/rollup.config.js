import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  plugins: [
    buble()
  ],
  external: [
    '@most/scheduler',
    '@most/disposable',
    '@most/prelude'
  ],
  targets: [
    {
      dest: 'dist/mostCore.js',
      format: 'umd',
      moduleName: 'mostCore',
      sourceMap: true,
      globals: {
        '@most/scheduler': 'mostScheduler',
        '@most/disposable': 'mostDisposable',
        '@most/prelude': 'mostPrelude'
      }
    },
    {
      dest: 'dist/mostCore.es.js',
      format: 'es',
      sourceMap: true
    }
  ]
}
