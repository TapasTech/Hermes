const qiniu = require('qiniu');
const config = require('../config');

qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;

function putToken(bucket) {
  var saveKey = 'hermes/images/$(etag)';
  var putPolicy = new qiniu.rs.PutPolicy2({
    scope: bucket,
    expires: 100,
    saveKey: saveKey,
    returnBody: '{' + [
      // '"name":$(fname)',
      // '"size":$(fsize)',
      // '"w":$(imageInfo.width)',
      // '"h":$(imageInfo.height)',
      '"path":"' + saveKey + '"',
      // '"key":$(key)',
      // '"hash":$(etag)',
    ].join(',') + '}',
  });
  return putPolicy.token();
}

module.exports = {
  putToken: () => putToken('hermes-staging'),
};
