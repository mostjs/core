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
