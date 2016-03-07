const koa = require('koa');
const qiniu = require('./lib/qiniu');
const config = require('./config');

const app = koa();

app.use(function* (next) {
  if (this.path === '/_puttoken') {
    this.body = qiniu.putToken();
  } else {
    yield* next
  }
});

app.listen(config.port, () => {
  console.log(`Listening at port ${config.port}...`);
});
