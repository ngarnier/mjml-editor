import { StatsWriterPlugin } from 'webpack-stats-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import merge from 'webpack-merge'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import webpack from 'webpack'

import webpackConfig from './base.config'

export default merge(webpackConfig, {
  devtool: 'source-map',
  output: {
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
  },
  module: {
    rules: [ {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader?sourceMap',
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: [
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      }),
    } ],
  },
  plugins: [
    // css extraction
    new ExtractTextPlugin('main-[hash].css'),

    // optimizations
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        warnings: false,
        screw_ie8: true,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        screw_ie8: true,
      },
    }),

    // stats, progress
    new ProgressBarPlugin(),
    new StatsWriterPlugin({
      transform: data => JSON.stringify({
        main: data.assetsByChunkName.main[0],
        styles: data.assetsByChunkName.main[1],
      }, null, 2),
    }),
  ],
})
