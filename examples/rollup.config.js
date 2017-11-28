import node from 'rollup-plugin-node-resolve'
import flow from 'rollup-plugin-flow'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'

export default {
  plugins: [
    flow(),
    node(),
    uglify({}, minify)
  ],
  output: {
    format: 'iife',
    sourcemap: true
  }
}
