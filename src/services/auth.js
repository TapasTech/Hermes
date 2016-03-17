import {GQL} from '#/utils';
import Store from '#/store';
import AppDispatcher from '#/dispatcher';

const TOKEN_KEY = '__AUTH';

let TOKEN = localStorage.getItem(TOKEN_KEY);
GQL.config({auth: TOKEN});

export function setToken(token) {
  TOKEN = token;
  GQL.config({auth: token});
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);
};

const userFields = GQL.template`
id
email
displayName
gender
description
avatar
`;

function prepareLogIn(email, password) {
  const query = GQL.template`
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
  const query = GQL.template`createUser(displayName: "${displayName}", email: "${email}", password: "${password}") {id}`;
  return {
    query,
  };
}

function prepareUserInfo() {
  const query = GQL.template`me { ${userFields} }`;
  const callback = data => {
    if (data.me) {
      AppDispatcher.dispatch({
        type: 'USER_INFO',
        data: data.me,
      });
    } else {
      // Token is invalid
      clearUserInfo();
    }
  };
  return {
    query,
    callback,
  };
}

function clearUserInfo() {
  AppDispatcher.dispatch({
    type: 'USER_LOGOUT',
    data: {},
  });
}

export function getUserInfo() {
  if (TOKEN) {
    GQL.handleQueries(
      prepareUserInfo()
    ).catch(err => {
      clearUserInfo();
    });
  } else {
    clearUserInfo();
  }
};

export function logIn(email, password) {
  return GQL.handleMutations(
    prepareLogIn(email, password)
  );
};

export function signUp(displayName, email, password) {
  return GQL.handleMutations(
    prepareSignUp(displayName, email, password),
    prepareLogIn(email, password)
  );
};

export function requireAuth(nextState, replace) {
  if (!Store.user.index().data.id) {
    replace({
      pathname: '/account',
    });
  }
};
