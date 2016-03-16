import fetch from 'isomorphic-fetch';
import Store from '#/store';

const AUTH_KEY = 'Http-Authorization';
let myRoot = '/graphql';
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

export function post(query) {
  query = query.replace(/\s+/g, ' ').trim();
  return request('POST', query);
}

function request(method, query) {
  let config = {
    method,
    headers: myHeaders,
  };
  config.body = JSON.stringify({query});
  return myFetch(myRoot, config)
  .then(res => {
    return res.json()
    .then(result => {
      if (res.status > 300 || !result.data && result.errors) {
        throw {
          status: res.status,
          data: result,
        };
      }
      return result.data;
    });
  })
  .catch(err => {
    let content = '未知错误！';
    if (err.status === 500) {
      content = '服务器错误！';
    } else if (!err.status) {
      content = '网络错误！';
    }
    Store.emit('EVT_MSG', {
      type: 'error',
      content,
    });
    throw err;
  });
}

function handleBadResponse(err) {
  console.log('错误👇');
  console.log(err);
}

function handleGraphQL(type, queries) {
  const queryData = queries.reduce((res, item) => {
    if (item) {
      item.query && res.queries.push(item.query);
      item.callback && res.callbacks.push(item.callback);
      if (item.fragments) {
        if (item.fragments.splice)
          res.fragments = res.fragments.concat(item.fragments);
        else
          res.fragments.push(item.fragments);
      }
    }
    return res;
  }, {queries: [], callbacks: [], fragments: []});
  if (!queryData.queries.length) return Promise.resolve();
  const query = template`${type} { ${queryData.queries.join(' ')} } ${queryData.fragments.join(' ')}`;
  return post(query).then(data => (
    Promise.all(queryData.callbacks.map(callback => callback(data)))
  ));
}

const mergeQueries = function () {
  let _queries = [];
  let _fulfillers = [];
  let timer;
  return {
    append,
  };

  function start() {
    const queries = _queries;
    const fulfillers = _fulfillers;
    _queries = [];
    _fulfillers = [];
    timer = null;
    handleGraphQL('query', queries)
    .then(res => {
      fulfillers.forEach(fulfiller => fulfiller.resolve(res));
    }, res => {
      fulfillers.forEach(fulfiller => fulfiller.reject(res));
    });
  }
  function append(queries, resolve, reject) {
    _queries = _queries.concat(queries);
    _fulfillers.push({resolve, reject});
    if (!timer) {
      timer = Promise.resolve().then(start);
      //timer = setTimeout(start, 200);
    }
  }
}();

export function handleQueries(...queries) {
  return new Promise((resolve, reject) => {
    mergeQueries.append(queries, resolve, reject);
  });
  //return handleGraphQL('query', queries);
}

export function handleMutations(...queries) {
  return handleGraphQL('mutation', queries);
}

function clearPiece(piece) {
  return piece
  .replace(/\s*([^\w\s]+)\s*/g, '$1')
  .replace(/\s+/g, ' ');
}

export function template(pieces, ...values) {
  const res = values.reduce((res, value, i) => {
    res += value == null ? '' : value;
    res += clearPiece(pieces[i + 1]);
    return res;
  }, clearPiece(pieces[0]));
  return res.trim();
}
