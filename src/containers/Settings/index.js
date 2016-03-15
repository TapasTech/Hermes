import React from 'react';
import {Link, browserHistory} from 'react-router';

import {Tabs, Loader} from '#/components';
import {GQL, encodeField} from '#/utils';
import UserInfo from './UserInfo';
import Avatar from './Avatar';
import Password from './Password';

import style from './style.less';

export default class Settings extends React.Component {
  state = {
    loading: true,
  }

  componentDidMount() {
    GQL.handleQueries(
      this.prepareData()
    );
  }

  onUpdate = update => {
    return GQL.handleQueries(
      this.prepareUpdate(update)
    );
  }

  onCancel = () => {
    browserHistory.push(`/user/${this.state.me.id}`);
  }

  render() {
    const tab = this.props.params.tab || '';
    const {me, loading} = this.state;
    const index = ['', 'avatar', 'password'].indexOf(tab);
    if (!~index) browserHistory.push('/settings');
    const tabs = [{
      title: <Link to="/settings">个人信息</Link>,
    }, {
      title: <Link to="/settings/avatar">设置头像</Link>,
    }, {
      title: <Link to="/settings/password">修改密码</Link>,
    }];
    const Tab = [UserInfo, Avatar, Password][index];
    return (
      <div className="container">
        {loading && <Loader full={true} />}
        <div className="main">
          <div className="panel">
            <Tabs tabs={tabs} active={index}>
              {Tab && me && <Tab me={me} onUpdate={this.onUpdate} onCancel={this.onCancel} />}
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  prepareData() {
    const query = GQL.template`
    me {
      id
      ...fragUserInfo
      ...fragUserAvatar
    }`;
    const callback = data => {
      const {me} = data;
      this.setState({
        me,
        loading: false,
      });
    };
    return {
      query,
      callback,
      fragments: [
        UserInfo.fragments,
        Avatar.fragments,
      ],
    };
  }

  prepareUpdate(update) {
    const {
      displayName, gender, description, email, avatar,
      location,
      employment, position,
      education,
    } = update;
    const {me} = this.state;
    const updated = {};
    const queries = [];
    const notEmpty = list => list.some(v => v != null);
    const fallback = (value, key) => {
      return (value == null ? me[key] : value) || '';
    };
    if (notEmpty([displayName, gender, description, email, avatar])) {
      queries.push(
        GQL.template`
        mutation { update(
          displayName: ${encodeField(fallback(displayName, 'displayName'))},
          description: ${encodeField(fallback(description, 'description'))},
          gender: ${fallback(gender, 'gender')},
          email: ${encodeField(fallback(email, 'email'))},
          avatar: ${encodeField(fallback(avatar, 'avatar'))}
        ) {id} }`
      );
      Object.assign(updated, {
        displayName,
        gender,
        description,
        avatar,
      });
    }
    if (location != null) {
      queries.push(
        GQL.template`
        location {
          mutation {
            update(name: ${encodeField(location || '')}) {name}
          }
        }`
      );
      updated.location = {name: location};
    }
    if (notEmpty([employment, position])) {
      queries.push(
        GQL.template`
        employment {
          mutation {
            update(employment: ${encodeField(employment || '')}, position: ${encodeField(position || '')}) {employment}
          }
        }`
      );
      updated.employment = {employment, position};
    }
    if (education != null) {
      queries.push(
        GQL.template`
        education {
          mutation {
            update(organization: ${encodeField(education || '')}) {organization}
          }
        }`
      );
      updated.education = {organization: education};
    }
    if (!queries.length) return;
    const query = GQL.template`me { ${queries.join(' ')} }`;
    const callback = data => {
      this.setState({
        me: {
          ... this.state.me,
          ... updated,
        }
      });
    };
    return {
      query,
      callback,
    };
  }
}
