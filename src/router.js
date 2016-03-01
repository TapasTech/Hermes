import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Pages from './containers';

export default class Root extends React.Component {

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Pages.Base}>
          <IndexRoute component={Pages.TopicList} />
          <Route path="detail/:id" component={Pages.TopicDetail} />
          <Route path="discovery" component={Pages.Discovery} />
          <Route path="search" component={Pages.SearchResult} />
          <Route path="ask/:id" component={Pages.Ask} />
          <Route path="reply/:id" component={Pages.Reply} />
        </Route>
      </Router>
    );
  }
}
