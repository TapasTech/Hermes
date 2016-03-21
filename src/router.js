import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import {requireAuth} from '#/services/auth';

import Pages from './containers';

function requireQ(nextProps, replace) {
  if (!nextProps.location.query.q) {
    replace({
      pathname: '/',
    });
  }
}

export default class Root extends React.Component {

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Pages.Base}>
          <IndexRoute component={Pages.AnswerList} />
          <Route path="account" component={Pages.Account} />
          <Route path="discovery" component={Pages.Discovery}>
            <IndexRoute />
            <Route path=":id" />
          </Route>
          <Route path="search" component={Pages.Search} onEnter={requireQ} />
          <Route path="question">
            <Route path="_new" component={Pages.Question} onEnter={requireAuth} />
            <Route path=":id" component={Pages.QuestionDetail} />
            <Route path=":id/edit" component={Pages.Question} onEnter={requireAuth} />
            <Route path=":id/answer" component={Pages.Answer} onEnter={requireAuth} />
            <Route path=":id/answer/:ansId" component={Pages.Answer} onEnter={requireAuth} />
          </Route>
          <Route path="user">
            <Route path=":id" component={Pages.PersonalCenter} />
            <Route path=":id/:tab" component={Pages.PersonalCenter} />
          </Route>
          <Route path="rank" component={Pages.AnalystRank} />
          <Route path="settings" component={Pages.Settings}>
            <IndexRoute />
            <Route path=":tab" />
          </Route>
          <Route path="race">
            <IndexRoute component={Pages.Race} />
            <Route name="all" path="all" component={Pages.Race} />
            <Route path=":id" component={Pages.RaceDetail} />
            <Route path=":id/:tab" component={Pages.RaceDetail} />
            {/*
            <Route path="_new" component={Pages.RaceEdit} />
            <Route path=":id/edit" component={Pages.RaceEdit} />
            */}
          </Route>
        </Route>
      </Router>
    );
  }
}
