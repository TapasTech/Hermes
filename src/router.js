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
          <Route path="discovery" component={Pages.Discovery} />
          <Route path="search" component={Pages.SearchResult} />
          <Route path="question">
            <Route path="_new" component={Pages.Question} />
            <Route path=":id" component={Pages.Detail} />
            <Route path=":id/edit" component={Pages.Question} />
            <Route path=":id/answer" component={Pages.Answer} />
            <Route path=":id/answer/:ansId" component={Pages.Answer} />
          </Route>
          <Route path="user">
            <Route path=":id" component={Pages.PersonalCenter} />
            <Route path=":id/:tab" component={Pages.PersonalCenter} />
          </Route>
        </Route>
      </Router>
    );
  }
}
