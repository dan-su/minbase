var h = require('hyperscript')
var blobUrl = require('./helpers').bloburl
var markdown = require('./helpers').markdown

var config = require('../config')()

exports.gives = { 
  message_content_mini: true
}

exports.create = function (api) {
  exports.message_content_mini = function (msg) {
    var about = msg.value.content
    var id = msg.value.content.about
    if (msg.value.content.type == 'description') {
      return h('span', markdown('**Description:** ' + about.description))
    }
    if (msg.value.content.type == 'loc') {
      return h('span', h('strong', 'Location: '), about.loc)
    } 
    if (msg.value.content.type == 'about') {
      if (msg.value.content.name) {
        return h('span', 'identifies as ', about.name)
      }
      if (msg.value.content.image) {
        console.log(msg.value.content.image)
        return h('span.avatar--tiny', 'identifies as ', h('img', {src: config.blobsUrl + about.image.link}))
      }
    } else { return }
  }
  return exports
}
