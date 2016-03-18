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
        path: path => path === '/graphql' || path.startsWith('/put_tokens/'),
      },
      target: 'http://hermes-devel.dtcj.com',
      changeOrigin: true,
    }],
  }));

  // app.use(function* (next) {
  //   yield send(this, '/index.html', {root: 'build'});
  // });

  const compiler = webpack(webpackConfig);
  const middleware = webpackDevMiddleware(compiler, options);
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  // history fallback
  app.use(historyFallback);
  app.use(middleware);
}

function* historyFallback(next) {
  this.url = '/';
  yield* next;
}
