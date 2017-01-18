module.exports = {
  mocha: {
    patterns: [
      'test/**/*.js',
      '!test/flow/**/*.*',
      '!test/perf/**/*.*'
    ]
  }
}
