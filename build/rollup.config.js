import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    // exports: 'named',
    name: 'ptHelper',
    file: 'dist/index.js',
    format: 'esm'
  },
});

export default config
