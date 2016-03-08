import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import {isProd} from './config';

const imageName = `images/[name]${isProd ? '.[hash:8]' : ''}.[ext]`;
const fontName = `fonts/[name]${isProd ? '.[hash:8]' : ''}.[ext]`;

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
      { test: /\.js$/, loader: 'babel', include: path.resolve('src'), query: {presets: ['react', 'es2015', 'stage-0']} },
      { test: /\.css$/, loader: cssLoader('css?importLoaders=1!postcss?pack=default'), include: path.resolve('src') },
      { test: /\.css$/, loader: cssLoader('css!postcss?pack=default'), include: path.resolve('node_modules') },
      { test: /\.less$/, loader: cssLoader('css?importLoaders=1!less') },
      { test: /\.(png|jpg|gif|svg)$/, loader: 'url', query: { limit: 10000, name: imageName } },
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
    new HtmlWebpackPlugin({ template: 'src/index.html', inject: 'body' }),
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
