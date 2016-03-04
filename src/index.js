import React from 'react';
import ReactDOM from 'react-dom';

import Root from './router';

import './config';

import 'normalize.css';
import './main.less';

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
