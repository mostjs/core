import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    })
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
