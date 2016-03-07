const koa = require('koa');
const qiniu = require('./lib/qiniuHelper');
const config = require('./config');

const webpack = require('webpack');
const webpackDevMiddleware = require("koa-webpack-dev-middleware");
const webpackHotMiddleware = require("koa-webpack-hot-middleware");
const webpackConfig = require('../webpack.config.dev');

const app = koa();

app.use(function* (next) {
  if (this.path === '/_puttoken') {
    this.body = qiniu.putToken();
  } else {
    yield* next
  }
});

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require("koa-webpack-dev-middleware");
  const webpackHotMiddleware = require("koa-webpack-hot-middleware");
  const webpackConfig = require('../webpack.config.dev');

  var compiler = webpack(webpackConfig)
  var options = {
    noInfo: false,
    quiet: false,
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true }
  }

  app.use(webpackDevMiddleware(compiler, options))
  app.use(webpackHotMiddleware(compiler))
}

app.listen(config.port, () => {
  console.log(`Listening at port ${config.port}...`);
});
