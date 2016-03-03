import { EventEmitter } from 'events';

let _store = {};

export default Object.assign({}, EventEmitter.prototype, {

  index() {
    return _store;
  },

  create(text) {
    // mutation
    _store = Object.assign({},
      _store,
      text
    );
  },

  update(id, text) {
    // mutation
  }
});
