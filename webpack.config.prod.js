var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var autoprefixer = require('autoprefixer')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var imageName = 'images/[name].[hash:8].[ext]'
var fontName = 'fonts/[name].[hash:8].[ext]'

var webpackConfig = require('./webpack.config.dev')

module.exports = {
  devtool: false,
  entry: {
    main: webpackConfig.entry.main,
    vendor: webpackConfig.entry.vendor.filter(function (x) { return x.match(/^webpack/) == null })
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].[chunkhash:8].js',
    publicPath: '/'
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      { test: /\.js$/, loader: 'babel', include: /src/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css?importLoaders=1!postcss?pack=default'), include: /src/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css!postcss?pack=default'), include: /node_modules/ },
      { test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css!postcss?pack=default!less') },
      { test: /\.(png|jpg|gif|svg)$/, loader: 'url', query: { limit: 10000, name: imageName } },
      { test: /\.(woff|woff2|ttf|eot)$/, loader: 'url', query: { limit: 10000, name: fontName} }
    ]
  },
  postcss: webpackConfig.postcss,
  externals: webpackConfig.externals,
  resolve: webpackConfig.resolve,
  plugins: [
    new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('production') } }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.[chunkhash:8].js', minChunks: Infinity }),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, sourceMap: false }),
    new ExtractTextPlugin('[name].[chunkhash:8].css', { allChunks: true }),
    new HtmlWebpackPlugin({ template: 'src/index.html', inject: 'body' }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}
