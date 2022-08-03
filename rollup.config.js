import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: './src/index.js',

  output: {
    file: './dist/Vue.js',
    format: 'umd',
    name: 'Vue'
  },
  
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve({})
  ],

  onwarn (warning) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      return
    }
  }
}