var h = require('hyperscript')
var messageLink = require('./helpers').message_link
var markdown = require('./helpers').markdown 

exports.gives = 'message_content'

exports.create = function (api) {
  return function (data) {
    if(!data.value.content || !data.value.content.text) return

    var root = data.value.content.root
    var re = !root ? null : h('span', 're: ', messageLink(root))

    return h('div',
      re,
      markdown(data.value.content)
    )

  }
}













