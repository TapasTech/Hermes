import { EventEmitter } from 'events';

let _store = {
  user: {
    data: {}
  },
  hotAnswers: {
    data: []
  },
};

const user = {
  index() {
    return _store.user;
  },

  update(text) {
    _store.user = {
      ..._store.user,
      ...text
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
      ...text
    };
  }
}

export default Object.assign({}, EventEmitter.prototype, {
  user,
  hotAnswers
});
