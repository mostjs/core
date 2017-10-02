import node from 'rollup-plugin-node-resolve'
import flow from 'rollup-plugin-flow'

export default {
  input: 'src/index.js',
  plugins: [
    flow(),
    node()
  ],
  output: {
    file: 'dist/index.js',
    format: 'iife'
  }
}
