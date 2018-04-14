var h = require('hyperscript')
var messageLink = require('./helpers').message_link
var markdown = require('./helpers').markdown 

var pull = require('pull-stream')

var query = require('./scuttlebot').query
var id = require('./../keys').id
var timestamp = require('./helpers').timestamp

exports.gives = 'message_content'

exports.needs = {message_compose: 'first' }

exports.create = function (api) {
  return function (data) {
    if(!data.value.content || !data.value.content.text) return

    var root = data.value.content.root
    var re = !root ? null : h('span', 're: ', messageLink(root))

    return h('div',
      re,
      markdown(data.value.content)
    )


    /*if(!data.value.content || !data.value.content.text) return
    if(data.value.content.type === 'edit') return

    function re (data) {
      var root = data.value.content.root
      if (root)
        return h('span', 're: ', messageLink(root))
    }

    var meta = {
      type: 'edit',
      edited: data.key
    }

    var original = data

    function getEditor (data) {
      if (data.value.author == id) {
        return h('div.editor',
          h('a', {href: '#' + data.key}, 'Edit'),
          h('span#' + data.key, 
            api.message_compose(meta, {text: data.value.content.text})
          )
        )
      } else { return h('span.editor','')}
    }

    var message = 
      h('div', 
        re(data) 
      )
    message.appendChild(h('div.innercontent', markdown(data.value.content.text)))


    pull(query({query: [{$filter: { value: { author: data.value.author, content: {type: 'edit', edited: data.key}}}}], limit: 100}),
      pull.collect(function (err, data){
        if(data[0]) {
          var fin = data.length
          for (var i = 0; i < fin; i++) {
            edited = data[i]
            message.appendChild(
              h('div.innercontent',
                h('span.edited', 'Edited ', timestamp(edited)),
                markdown(edited.value.content.text)
              )
            )
          }
          message.appendChild(getEditor(data[fin - 1]))
        } else {
          message.appendChild(getEditor(original))
        }
      })
    )
    return message
    */

 
  }
}


