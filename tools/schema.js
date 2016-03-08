var fs = require('fs')
var path = require('path')
var request = require('request')
var parser = require('graphql-readable')

request({
  url: 'http://hermes-devel.dtcj.com/graphql',
  headers: {
    'Content-Type': 'application/json'
  }
}, function (err, res, body) {
  if (err) console.log(err)
  fs.writeFileSync(
    path.join(__dirname, '../schema/schema.json'),
    JSON.stringify(JSON.parse(body), null, '\t')
  )

  fs.writeFileSync(
    path.join(__dirname, '../schema/schema.graphql'),
    parser(JSON.parse(body), 'GraphQL')
  )
})
