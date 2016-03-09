const fs = require('fs');
const path = require('path');
const http = require('http');
const parser = require('graphql-readable');
const ensureDir = require('ensure-dir');

new Promise((resolve, reject) => http.get('http://hermes-devel.dtcj.com/graphql', res => {
  var data = '';
  res
  .on('data', chunk => data += chunk)
  .on('end', () => resolve(data))
  .on('error', err => reject(err));
})).then(raw => {
  const data = JSON.parse(raw);
  ensureDir('schema').then(() => {
    fs.writeFile('schema/schema.json', JSON.stringify(data, null, '\t'));
    fs.writeFile('schema/schema.graphql', parser(data, 'GraphQL'));
  });
});
