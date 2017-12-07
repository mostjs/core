const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './counter/src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'counter/dist')
  },
  resolve: {
    mainFields: [ 'module', 'jsnext:main', 'browser', 'main' ]
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new UglifyJSPlugin()
  ]
}
