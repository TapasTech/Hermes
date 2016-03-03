import { EventEmitter } from 'events';

let _store = {
  user: {},
  hotAnswers: {},
};

const user = {
  index() {
    return _store.user;
  },

  update(text) {
    _store.user = {
      ..._store.user,
      data: text
    }
  },

  destroy() {
    _store.user = {};
  }
};

const hotAnswers = {
  index() {
    return _store.hotAnswers;
  },

  update(text) {
    _store.hotAnswers = {
      ..._store.hotAnswers,
      data: text
    };
    console.log(_store);
  }
}

export default Object.assign({}, EventEmitter.prototype, {
  user,
  hotAnswers
});
