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

class EventEmitter {
  constructor() {
    this.data = {};
  }

  on(type, cb) {
    let callbacks = this.data[type];
    if (!callbacks) {
      callbacks = this.data[type] = [];
    }
    callbacks.push(cb);
  }

  off(type, cb) {
    const callbacks = this.data[type] || [];
    const i = callbacks.indexOf(cb);
    ~i && callbacks.splice(i, 1);
  }

  emit(type, ...args) {
    const callbacks = this.data[type];
    callbacks && callbacks.forEach(callback => {
      callback(...args);
    });
  }
}

export default Object.assign(new EventEmitter, {
  user
});
