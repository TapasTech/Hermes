import {GraphqlRest} from '#/utils';
import Store from '#/store';
import AppDispatcher from '#/dispatcher';

const TOKEN_KEY = '__AUTH';

let TOKEN = localStorage.getItem(TOKEN_KEY);
GraphqlRest.config({auth: TOKEN});

export function setToken(token) {
  TOKEN = token;
  GraphqlRest.config({auth: token});
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);
};

const userFields = `
id
email
displayName
gender
description
`;

function prepareLogIn(email, password) {
  const query = `
  logIn: createAuthToken(email: "${email}", password: "${password}") {
    authToken
    user {
      ${userFields}
    }
  }
  `;
  const callback = data => {
    const { authToken, user } = data.logIn;
    AppDispatcher.dispatch({
      type: 'USER_LOGIN',
      data: {
        authToken,
        user,
      }
    });
  };
  return {
    query,
    callback,
  };
}

function prepareSignUp(displayName, email, password) {
  const query = `createUser(displayName: "${displayName}", email: "${email}", password: "${password}") {id}`;
  return {
    query,
  };
}

function prepareUserInfo() {
  const query = `me { ${userFields} }`;
  const callback = data => {
    if (data.me) {
      AppDispatcher.dispatch({
        type: 'USER_INFO',
        data: data.me,
      });
    } else {
      // Token is invalid
      AppDispatcher.dispatch({
        type: 'USER_LOGOUT',
        data: {},
      });
    }
  };
  return {
    query,
    callback,
  };
}

export function getUserInfo() {
  return TOKEN && GraphqlRest.handleQueries(
    prepareUserInfo()
  );
};

export function logIn(email, password) {
  return GraphqlRest.handleMutations(
    prepareLogIn(email, password)
  );
};

export function signUp(displayName, email, password) {
  return GraphqlRest.handleMutations(
    prepareSignUp(displayName, email, password),
    prepareLogIn(email, password)
  );
};
