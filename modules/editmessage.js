var h = require('hyperscript')

var link = require('./helpers').message_link

exports.gives = 'message_content_mini'

exports.create = function (api) {
  return function (data) {
    if(data.value.content.type == 'edit')
      var edit = h('span', 'edited ', link(data.value.content.edited))
    return edit 
  }
}
