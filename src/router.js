import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Pages from './containers';

export default class Root extends React.Component {

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Pages.Base}>
          <IndexRoute component={Pages.QuestionList} />
          <Route path="detail:id" component={Pages.QuestionDetail} />
          <Route path="discovery" component={Pages.Discovery} />
          <Route path="search" component={Pages.SearchResult} />
        </Route>
      </Router>
    );
  }
}
