import fetch from 'isomorphic-fetch';

const token = {};

function getToken() {
  return new Promise((resolve, reject) => {
    if (token.data && token.expires < Date.now()) {
      return resolve(token.data);
    }
    fetch('/_puttoken')
    .then(res => res.text())
    .then(text => {
      token.expires = Date.now() + 60 * 1000;
      resolve(token.data = text);
    });
  });
}

export function upload(file) {
  return getToken().then(token => new Promise((resolve, reject) => {
    const formData = new FormData;
    formData.append('token', token);
    formData.append('file', file);
    const xhr = new XMLHttpRequest;
    xhr.open('POST', 'http://upload.qiniu.com', true);
    xhr.onloadend = function () {
      const result = JSON.parse(this.responseText);
      if (this.status !== 200) {
        reject({
          status: this.status,
          data: result,
        });
      } else {
        resolve(result);
      }
    };
    xhr.send(formData);
  }));
}

export function getUrl(data, options) {
  options = options || {};
  var params = ['w', 'h', 'q'].reduce((result, k) => {
    var v = options[k];
    return result + (v ? '/' + k + '/' + v : '');
  }, '');
  if (params) params = '?imageView2/1' + params;
  return 'http://7xrmgq.com2.z0.glb.qiniucdn.com/' + data.path + params;
}
