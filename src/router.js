import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Pages from './containers';

export default class Root extends React.Component {

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Pages.Base}>
          <IndexRoute component={Pages.AnswerList} />
          <Route path="account" component={Pages.Account} />
          <Route path="detail/:id" component={Pages.TopicDetail} />
          <Route path="discovery" component={Pages.Discovery} />
          <Route path="search" component={Pages.SearchResult} />
          <Route path="question">
            <Route path="_new" component={Pages.Ask} />
            <Route path=":id" component={Pages.Ask} />
            <Route path=":id/edit" component={Pages.Ask} />
            <Route path=":id/reply" component={Pages.Reply} />
          </Route>
          <Route path="person/:id" component={Pages.PersonalCenter} />
        </Route>
      </Router>
    );
  }
}
