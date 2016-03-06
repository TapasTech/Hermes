import { Dispatcher } from 'flux';
import Store from '#/store';
import {GraphqlRest, setToken} from '#/utils';

let AppDispatcher = new Dispatcher();

AppDispatcher.register(function(action) {
  const { type, text, data } = action;
  if (process.env.NODE_ENV === 'development') {
    console.log(`event: ${type}`);
  }

  switch(type) {
    case 'USER_INFO':
      Store.user.update({data});
      Store.emit('EVT_USER');
      break;
    case 'USER_LOGIN':
      setToken(data.authToken);
      Store.user.update({data: data.user});
      Store.emit('EVT_USER');
      break;
    case 'USER_CREATE':
      if (text) {
        const data = Object.assign(Store.user.index().data, text);
        Store.user.update(data);
        Store.emit('EVT_USER');
      }
      break;
    case 'USER_LOGOUT':
      setToken();
      Store.user.update({data});
      Store.emit('EVT_USER');
      break;
    case 'USER_UPDATE':
      break;

    default:
      // no op
  }
});

export default AppDispatcher
