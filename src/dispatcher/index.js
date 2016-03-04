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

    case 'HOTANSWER_INDEX':
      if (text) {
        Store.hotAnswers.update({data: text});
        Store.emit('change');
      }
      break;

    case 'HOTANSWER_POKE':
      if (text) {
        const hotAnswers = Store.hotAnswers.index().data;
        const idArray = hotAnswers.map(item => item.id);
        const position = idArray.indexOf(text.id);
        if (position > -1) {
          hotAnswers[position] = Object.assign(hotAnswers[position], text);
        }
        Store.hotAnswers.update({data: hotAnswers});
        Store.emit('change');
      }
      break;

    case 'HOTANSWER_COMMENT':
      if (text) {
        Store.hotAnswers.update({data: text});
        Store.emit('change');
      }
      break;

    // data sets
    case 'DATASET_FETCH':
      if (text) {
        Store.dataSets.update({data: text});
      }
    default:
      // no op
  }
});

export default AppDispatcher
