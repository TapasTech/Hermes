var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var imageName = 'images/[name].[ext]'
var fontName = 'fonts/[name].[ext]'

module.exports = {
  devtool: 'eval',
  entry: {
    main: './src/index',
    vendor: [
      'webpack-hot-middleware/client'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      { test: /\.js$/, loader: 'babel', include: /src/ },
      { test: /\.css$/, loader: 'style!css?importLoaders=1!postcss?pack=default', include: /src/ },
      { test: /\.css$/, loader: 'style!css!postcss?pack=default', include: /node_modules/ },
      { test: /\.less$/, loader: 'style!css?importLoaders=1!less' },
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
      '#': path.join(process.cwd(), './src')
    }
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js', minChunks: Infinity }),
    new HtmlWebpackPlugin({ template: 'src/index.html', inject: 'body' }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}

