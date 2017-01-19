import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import path from 'path'
import webpack from 'webpack'
import mapValues from 'lodash/mapValues'

require('dotenv').config()

const globals = require('../src/globals')

const dist = path.resolve(__dirname, '../dist')
const styles = path.resolve(__dirname, '../src/styles')

const postcssPlugins = [
  autoprefixer({
    browsers: [
      'last 2 versions',
    ],
  }),
]

if (globals.__DEV__) {
  postcssPlugins.push(
    cssnano({
      autoprefixer: false,
      safe: true,
    })
  )
}

export default {
  performance: {
    hints: false,
  },
  resolve: {
    modules: [
      '../src',
      '../node_modules',
    ].map(p => path.resolve(__dirname, p)),
  },
  entry: [
    'babel-polyfill',
    './src/client.js',
  ],
  output: {
    chunkFilename: '[name].bundle.js',
    filename: 'bundle.js',
    path: dist,
    publicPath: '/dist/',
  },
  plugins: [
    new webpack.DefinePlugin(Object.assign({}, mapValues(globals, v => JSON.stringify(v)), {
      __BROWSER__: JSON.stringify(true),
      'process.env.NODE_ENV': JSON.stringify(__ENV__),
    })),
    new webpack.LoaderOptionsPlugin({
      options: {
        sassLoader: {
          includePaths: [
            styles,
          ],
        },
        postcss: postcssPlugins,
      },
    }),
  ],
}
