import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    })
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
