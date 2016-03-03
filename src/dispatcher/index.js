import { Dispatcher } from 'flux';
import Store from '#/store';

let AppDispatcher = new Dispatcher();

AppDispatcher.register(function(action) {
  const { type, text } = action;

  switch(type) {
    case 'USER_LOGIN':
      if (text) {
        Store.create(text);
        Store.emit('change');
      }
      break;
    case 'USER_CREATE':
      if (text) {
        Store.create(text);
        Store.emit('change');
      }
      break;
    case 'USER_UPDATE':
      if (text) {
        Store.update(action.id, {text: text});
        Store.emit('change');
      }
      break;

    default:
      // no op
  }
});

export default AppDispatcher
