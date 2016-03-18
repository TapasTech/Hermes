import React from 'react';
import {browserHistory} from 'react-router';

import Store from '#/store';
import {upload, getUrl} from '#/services/uploader';
import {GQL, encodeField} from '#/utils';
import {formatSize, selectFiles} from './utils';

import style from './style.less';

export default class Submit extends React.Component {
  static propTypes = {
    competitionId: React.PropTypes.string.isRequired,
  }

  state = {
    desc: '',
    files: [],
  }

  handleDescChange = e => {
    this.setState({
      desc: e.target.value,
    });
  }

  handleUpload = e => {
    e.preventDefault();
    selectFiles(file => {
      upload(file, 'data')
      .then(data => getUrl(data))
      .then(url => {
        this.setState({
          files: [
            ... this.state.files,
            {
              name: file.name,
              url,
              size: file.size,
            }
          ],
        });
      });
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    if (!this.state.files.length) {
      return this.setState({
        message: '请上传答案！',
      });
    }
    if (!this.state.desc) {
      return this.setState({
        message: '请填写简要描述！',
      });
    }
    this.setState({
      message: '',
    });
    GQL.handleQueries(
      this.prepareSubmit()
    );
  }

  prepareSubmit() {
    const id = this.props.competitionId;
    const {desc, files} = this.state;
    const mutations = files.map((file, index) => {
      const pieces = file.name.split('.');
      let format = '.' + pieces.pop();
      if (pieces.length < 2 && !pieces[0]) format = '';
      return GQL.template`attach_${index}: attachFile(name: ${encodeField(file.name)}, size: ${encodeField(file.size)}, format: ${encodeField(format)}, url: ${encodeField(file.url)}) {id}`;
    });
    const query = GQL.template`
    competition(id: ${encodeField(id)}) {
      mutation {
        createSolution(description: ${encodeField(desc)}) {
          mutation {
            ${mutations.join(' ')}
          }
        }
      }
    }
    `;
    const callback = data => {
      Store.emit('EVT_MSG', {
        content: '答案已提交！',
      });
      browserHistory.push(`/race/${id}`);
    };
    return {
      query,
      callback,
    };
  }

  render() {
    const {desc, files, message} = this.state;
    return (
      <div>
        <h2 className={style.tabTitle}>提交答案</h2>
        <div className={style.tabContent}>
          <div className={`pull-right ${style.submitHint}`}>
            <h3>文件格式</h3>
            <p>答案支持csv格式</p>
            <p>也可以上传zip/gr/rar/7z格式的压缩包</p>
          </div>
          <form className={style.submitPanel} onSubmit={this.handleSubmit}>
            <div className={style.submitFiles}>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>
                    <a href={file.url} target="_blank">{`${file.name} (${formatSize(file.size)})`}</a>
                  </li>
                ))}
              </ul>
              <div className={style.submitButtons}>
                <button className="btn btn-primary" onClick={this.handleUpload}>点击上传答案</button>
              </div>
            </div>
            <div className={style.submitInfo}>
              <textarea
                className="form-control"
                value={desc || ''}
                onChange={this.handleDescChange}
                placeholder="请填写答案的简要描述"
                required
              />
              <div className="text-danger">{message}</div>
              <div className={style.submitButtons}>
                <button type="submit" className="btn btn-primary">提交</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
