import merge from 'webpack-merge'
import webpack from 'webpack'

import webpackConfig from './base.config'

export default merge(webpackConfig, {
  devtool: 'eval',
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
  ],
  output: {
    filename: 'bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/dist/',
  },
  module: {
    rules: [ {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [ {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      } ],
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: [ {
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
      }, {
        loader: 'postcss-loader',
      }, {
        loader: 'sass-loader',
      } ],
    } ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
})
