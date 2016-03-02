import React from 'react';

import { HotTopics } from '#/components';

import styles from './style.less';

import { domainList, topicList } from '#/__mock__';

export default class Discovery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      domainSelected: domainList[0]
    };
  }

  handleDomainSelected(item) {
    this.setState({
      domainSelected: item
    });
  }

  renderTopicList(item, index) {
    return (
      <div className={styles.topicList} key={index}>
        <div className="reply item">
          <div className="num">{item.reply}</div>
          <div className="tip">回答</div>
        </div>
        <div className="read item">
          <div className="num">{item.read}</div>
          <div className="tip">阅读</div>
        </div>
        <div className="topic item">
          <div className="num">{item.question}</div>
          <div className="tip">{item.author.name} 参与讨论 {item.time}</div>
        </div>
      </div>
    );
  }

  render() {
    const { domainSelected } = this.state;

    let dataSource = topicList.filter(item => item.tag === domainSelected);
    return (
      <div className="container">
        <div className="main">
          <div className={styles.listArea}>
            <div className={styles.header}>最新问题</div>
            <div className={styles.domains}>
              {
                domainList.map((item, index) => {
                  const clx = item === domainSelected ? "item selected" : "item"
                  return (
                    <div key={index} className={clx} onClick={this.handleDomainSelected.bind(this, item)}>
                      <span className="name">{item}</span>
                    </div>
                  );
                })
              }
            </div>
            { dataSource.map((item, index) => this.renderTopicList(item, index)) }
          </div>
        </div>
        <div className="sidebar">
          <HotTopics />
        </div>
      </div>
    );
  }
}
