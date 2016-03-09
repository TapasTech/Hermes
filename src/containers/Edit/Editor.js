import React from 'react';
import TapasEditor from 'tapas-editor';
import {upload, getUrl} from '#/services/uploader';

const config = {
  statusbar: false,
  resize: false,
  menubar: '',
  toolbar: 'undo redo | bold removeformat image t_image',
  plugins: 'searchreplace autoresize paste t_image t_autofloat',
  content_style:
    '*{line-height:25px;color:#555;font-size:15px;font-family:\'Hiragino Sans GB\',\'Microsoft YaHei\',\'黑体\',Helvetica,Arial,Tahoma,sans-serif;}' +
    'img{max-width:100%;}' +
    'img.size-overflowed{box-sizing:border-box;border:2px solid red;-webkit-filter:opacity(.4);filter:opacity(.4);}' +
    'table{width:100%}',
  extended_valid_elements: 'a[href|target=_blank|title]',
  convert_urls: false,
  paste_as_text: true,
  paste_data_images: true,
  autoresize_min_height: 500,
  autofloat_top_offset: 64,
};

export default class Editor extends React.Component {
  static propTypes = {
    content: React.PropTypes.string,
    onChange: React.PropTypes.func,
  }

  handleUpload = (e, editor) => {
    const file = e.data;
    upload(file).then(data => e.callback(getUrl(data)));
  }

  render() {
    const events = {
      TUploadImage: this.handleUpload,
    };
    return (
      <TapasEditor
        config={config}
        events={events}
        content={this.props.content}
        onChange={this.props.onChange}
      />
    );
  }
}
