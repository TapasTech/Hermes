import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import apm from '../src/template/apm.js';
import {isProd} from './config';

const imageName = `images/[name]${isProd ? '.[hash:8]' : ''}.[ext]`;
const fontName = `fonts/[name]${isProd ? '.[hash:8]' : ''}.[ext]`;

const babelRC = {
  presets:  ['react', 'es2015-webpack2', 'stage-0'],
  plugins: ['transform-runtime'],
  env: {
    development: {
      presets: ['react-hmre']
    }
  },
  cacheDirectory: true
};

export default {
  devtool: isProd ? false : 'eval',
  entry: {
    main: './src/index',
    vendor: [
      ... isProd ? [] : [
        'webpack-hot-middleware/client'
      ],
    ]
  },
  output: {
    path: path.resolve('build'),
    filename: `[name]${isProd ? '.[chunkhash:8]' : ''}.js`,
    ... isProd ? {
      publicPath: 'http://7xrmgq.com2.z0.glb.qiniucdn.com/assets/',
    } : {
      publicPath: '/',
    },
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      { test: /\.js$/, loader: 'babel', include: path.resolve('src'), query: babelRC },
      { test: /\.css$/, loader: cssLoader('css?importLoaders=1!postcss?pack=default'), include: path.resolve('src') },
      { test: /\.css$/, loader: cssLoader('css!postcss?pack=default'), include: path.resolve('node_modules') },
      { test: /\.less$/, loader: cssLoader('css?importLoaders=1!less') },
      { test: /\.svg$/, loader: 'svg-sprite', include: path.resolve('src') },
      { test: /\.svg$/, loader: 'url', include: path.resolve('node_modules') },
      { test: /\.(png|jpg|gif)$/, loader: 'url', query: { limit: 10000, name: imageName } },
      { test: /\.(woff|woff2|ttf|eot)$/, loader: 'url', query: { limit: 10000, name: fontName} }
    ]
  },
  postcss: function () {
    return {
      default: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
    }
  },
  externals: {
  },
  resolve: {
    extensions: ['', '.js'],
    alias: {
      '#': path.resolve('src'),
    }
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env': {'NODE_ENV': `"${isProd ? 'production' : 'development'}"`}}),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: `vendor${isProd ? '.[chunkhash:8]' : ''}.js`, minChunks: Infinity }),
    new HtmlWebpackPlugin({
      favicon: './src/assets/favicon.ico',
      apm: isProd ? apm : '',
      template: 'src/template/index.ejs',
      inject: 'body'
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    ... isProd ? [
      new ExtractTextPlugin('[name].[chunkhash:8].css', { allChunks: true }),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, sourceMap: false }),
    ] : [
      new webpack.HotModuleReplacementPlugin(),
    ],
  ]
}

function cssLoader(loaders) {
  return isProd ? ExtractTextPlugin.extract('style', loaders) : 'style!' + loaders;
}
