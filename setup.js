var pull = require('pull-stream')
var client = require('ssb-client')
var key = require('./keys')
var ws = require('ssb-ws')
var chalk = require('chalk')

client(function (err, sbot) {
  console.log('\nThis is your public/private key, paste it into the `key` field at ' +  chalk.cyan('http://localhost:3013/#Key') + '\n')
  console.log(key)
  console.log('\nThis is your web socket remote, paste it into the `remote` field at ' + chalk.cyan('http://localhost:3013/#Key') + '\n')
  sbot.ws.getAddress(function (err, data) { console.log(data + '\n')})
  sbot.close()
})

