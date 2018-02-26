
var config = require('./config')().config
var ssbKeys      = require('ssb-keys')
var path         = require('path')

module.exports = ssbKeys.loadOrCreateSync(path.join(config.caps.shs + '/secret'))
