import webpack from 'webpack';
import webpackDevMiddleware from "koa-webpack-dev-middleware";
import webpackHotMiddleware from "koa-webpack-hot-middleware";
import proxypass from 'koa-proxypass';
// import send from 'koa-send';
import webpackConfig from '../webpack.config';

const options = {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
  stats: { colors: true }
};

export function register(app) {
  app.use(proxypass({
    upstreams: [{
      match: {
        path: '/graphql',
      },
      target: 'http://sayindata.dtcj.com:8080',
      changeOrigin: true,
    }],
  }));

  // app.use(function* (next) {
  //   yield send(this, '/index.html', {root: 'build'});
  // });

  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, options));
  app.use(webpackHotMiddleware(compiler));
}
