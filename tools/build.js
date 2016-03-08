import webpack from 'webpack';
import del from 'del';
import webpackConfig from './webpack.config';
import config from './config';

const compiler = webpack(webpackConfig);

(config.isProd ? del('build') : Promise.resolve())
.then(() => compiler.run((err, stats) => {
  console.log(`Build: ${stats.endTime - stats.startTime}ms`);
  if (stats.hasErrors()) {
    const errors = stats.toJson().errors;
    for (let err of errors) {
      console.log(err);
    }
  }
}));
