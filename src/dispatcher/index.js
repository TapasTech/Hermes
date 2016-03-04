import { Dispatcher } from 'flux';
import Store from '#/store';

let AppDispatcher = new Dispatcher();

AppDispatcher.register(function(action) {
  const { type, text } = action;
  if (process.env.NODE_ENV === 'development') {
    console.log(`event: ${type}`);
  }

  switch(type) {
    case 'USER_LOGIN':
      if (text) {
        const data = Object.assign(Store.user.index().data, text);
        Store.user.update(data);
        Store.emit('change');
      }
      break;
    case 'USER_CREATE':
      if (text) {
        const data = Object.assign(Store.user.index().data, text);
        Store.user.update(data);
        Store.emit('change');
      }
      break;
    case 'USER_LOGOUT':
      if (text) {
        Store.user.update({data: {}});
        Store.emit('change');
      }
      break;
    case 'USER_UPDATE':
      break;

    case 'HOTANSWER_INDEX':
      if (text) {
        Store.hotAnswers.update({data: text});
        Store.emit('change');
      }
      break;

    case 'HOTANSWER_POKE':
      if (text) {
        Store.hotAnswers.update({data: text});
        Store.emit('change');
      }
      break;

    case 'HOTANSWER_COMMENT':
      if (text) {
        Store.hotAnswers.update(text);
        Store.emit('change');
      }
      break;

    default:
      // no op
  }
});

export default AppDispatcher
