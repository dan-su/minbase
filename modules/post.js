var h = require('hyperscript')
var messageLink = require('./helpers').message_link
var markdown = require('./helpers').markdown 

var pull = require('pull-stream')

var query = require('./scuttlebot').query

var timestamp = require('./helpers').timestamp

exports.gives = 'message_content'

exports.needs = {message_compose: 'first' }

exports.create = function (api) {
  return function (data) {
    if(!data.value.content || !data.value.content.text) return
    if(data.value.content.type === 'edit') return

    var root = data.value.content.root
    var re = !root ? null : h('span', 're: ', messageLink(root))
    console.log(data)

    var meta = {
      type: 'edit',
      edited: data.key
    }

    var editor = h('div.editor', api.message_compose(meta, {text: data.value.content.text})) 

    var message = h('div', re, h('div.innercontent', h('span.edited', 'Unedited'), markdown(data.value.content.text), editor))

    pull(query({query: [{$filter: { value: { author: data.value.author, content: {type: 'edit', edited: data.key}}}}], limit: 100}),
      pull.collect(function (err, data){
        if(data[0]) {
          for (var i = 0; i < data.length; i++) {
            edited = data[i]
            console.log(edited.key)
            message.appendChild(
              h('div.innercontent', 
                h('span.edited', 
                  'Edited ', 
                  timestamp(edited)), 
                  markdown(edited.value.content.text),
                  api.message_compose(meta, {text: edited.value.content.text})
              )
            )
          }
        }
      })
    )

    return message

  }
}













