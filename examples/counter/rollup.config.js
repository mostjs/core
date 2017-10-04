import node from 'rollup-plugin-node-resolve'
import flow from 'rollup-plugin-flow'
import pkg from './package.json'

export default {
  input: 'src/index.js',
  plugins: [
    flow(),
    node()
  ],
  output: {
    file: pkg.main,
    format: 'iife'
  }
}
