import {config} from './graphql-rest';

const TOKEN_KEY = '__AUTH';

let TOKEN = localStorage.getItem(TOKEN_KEY);
config({auth: TOKEN});

export function setToken(token) {
  TOKEN = token;
  config({auth: token});
  console.log('set', token);
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);
};

export function hasToken() {
  return !!TOKEN;
};
