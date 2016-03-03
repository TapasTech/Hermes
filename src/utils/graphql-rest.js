import fetch from 'isomorphic-fetch';

let myRoot = '/api';
let myFetch = fetch;
let myHeaders;

function config(options) {
  const {root, fetch, headers} = options;
  if (typeof root === 'string')
    myRoot = root;
  if (typeof fetch === 'function')
    myFetch = fetch;
  if (typeof headers === 'object')
    myHeaders = headers;
}

function query(name, res) {
  return template`query { data: ${0} { ${1} } }`(name, res);
}

function mutation(name, res) {
  return template`mutation { data: ${0} { ${1} } }`(name, res);
}

function template(strings, ...keys) {
  return (function(...values) {
    var result = [strings[0]];
    keys.forEach(function(key, i) {
      var value = values[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  });
}

function post(query) {
  return request('POST', query);
}

function request(method, query) {
  let config = {
    method,
    headers: myHeaders,
  };
  config.body = JSON.stringify({query});
  return myFetch(myRoot, config)
  .then(handleResponse)
  .catch(handleBadResponse);
}

function handleResponse(res) {
  if (res.status === 200) {
    return res.json().then(respone => {
      if (respone.data) {
        return respone.data;
      }
      if (respone.errors) {
        throw respone.errors;
      }
    });
  }
}

function handleBadResponse(err) {
  console.log('错误👇');
  console.log(err[0].message);
}

module.exports = {
  config,
  query,
  mutation,
  post
};
