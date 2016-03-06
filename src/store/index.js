import { EventEmitter } from 'events';

let _store = {
  user: {
    data: {}
  }
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

export default Object.assign({}, EventEmitter.prototype, {
  user
});
