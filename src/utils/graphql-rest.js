import fetch from 'isomorphic-fetch';

const AUTH_KEY = 'Http-Authorization';
let myRoot = '/api';
let myFetch = fetch;
let myHeaders;
let myAuth;

export function config(options) {
  const {root, fetch, headers, auth} = options;
  if (typeof root === 'string')
    myRoot = root;
  if (typeof fetch === 'function')
    myFetch = fetch;
  if (headers)
    myHeaders = headers;
  if (auth != null)
    myAuth = auth;
  if (myHeaders && (headers || auth != null)) {
    if (myAuth) {
      myHeaders[AUTH_KEY] = myAuth;
    } else {
      delete myHeaders[AUTH_KEY];
    }
  }
}

export function query(name, res) {
  return template`query { data: ${0} { ${1} } }`(name, res);
}

export function mutation(name, res) {
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

export function post(query) {
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

function handleGraphQL(type, queries) {
  const queryData = queries.reduce((res, item) => {
    if (item) {
      item.query && res.queries.push(item.query);
      item.callback && res.callbacks.push(item.callback);
    }
    return res;
  }, {queries: [], callbacks: []});
  const query = `${type} { ${queryData.queries.join(' ')} }`;
  return post(query).then(data => {
    queryData.callbacks.forEach(callback => callback(data));
  });
}

export function handleQueries(...queries) {
  return handleGraphQL('query', queries);
}

export function handleMutations(...queries) {
  return handleGraphQL('mutation', queries);
}
