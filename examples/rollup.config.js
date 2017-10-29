import node from 'rollup-plugin-node-resolve'
import flow from 'rollup-plugin-flow'

export default {
  plugins: [
    flow(),
    node()
  ],
  output: {
    format: 'iife',
    sourcemap: true
  }
}
