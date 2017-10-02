import node from 'rollup-plugin-node-resolve'
import buble from 'rollup-plugin-buble'
import flow from 'rollup-plugin-flow'

export default {
  input: 'src/index.js',
  plugins: [
    flow(),
    buble(),
    node({
      modulesOnly: true
    })
  ],
  output: {
    file: 'dist/index.js',
    format: 'iife'
  }
}
