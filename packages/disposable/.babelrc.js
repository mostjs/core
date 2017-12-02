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
    'annotate-pure-calls'
  ]
}
