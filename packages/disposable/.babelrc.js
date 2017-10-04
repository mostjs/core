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
    ['transform-builtin-extend', {
      globals: ['Error']
    }],
    'annotate-pure-calls'
  ]
}
