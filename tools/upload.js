const qiniu = require('./lib/qiniu');
require('ensure-dir')('logs');

qiniu.getFiles('build/*', path => `assets${path.slice(5)}`)
.then(files => {
  qiniu.uploadFiles('hermes-staging', files, 'logs/qiniu.log');
});
