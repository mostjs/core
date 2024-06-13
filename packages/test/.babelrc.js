const modules = process.env.NODE_ENV === 'test' ? 'commonjs' : false

module.exports = {
  presets: [
    ['env', {
      modules,
      loose: true,
      forceAllTransforms: true
    }]
  ],
  plugins: [
    'transform-flow-strip-types',
    'annotate-pure-calls'
  ]
}
