const fs = require('fs');
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

/**
 * @desc Upload files to Qiniu
 * @param {String} bucket
 * @param {Array} files
 *     [{path: 'path/to/file', key: 'file-key-on-qiniu'}, ...]
 * @param {String} [logFile]
 * @return {Promise}
 */
function uploadFiles(bucket, files, logFile) {
  function upload(file) {
    return new Promise((resolve, reject) => {
      var token = putToken(bucket + ':' + file.key);
      qiniu.io.putFile(token, file.key, file.path, null, function(err, ret) {
        if (err) reject(err);
        else {
          if (logFile)
            fs.appendFileSync(logFile, new Date() + ' | ' + file.key + '\n');
          resolve();
        }
      });
    })
    .then(() => {
      console.log(file.key);
    }, err => {
      console.error(file.key + ':', err);
    });
  }
  return Promise.all(files.map(file => upload(file)));
}

function getFiles(pattern, keyFunc) {
  if (!keyFunc) keyFunc = (path) => path;
  const glob = require('glob');
  return new Promise((resolve, reject) => {
    glob(pattern, {nodir: true}, (err, matches) => {
      err ? reject(err) : resolve(matches.map((file) => {
        return {
          path: file,
          key: keyFunc(file),
        };
      }));
    });
  });
}

module.exports = {
  putToken: () => putToken('hermes-staging'),
  uploadFiles,
  getFiles,
};
