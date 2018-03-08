var h = require('hyperscript')
var pull = require('pull-stream')
var timestamp = require('./helpers').timestamp
var messageLink = require('./helpers').message_link
var getStars = require('./getstars').getstars


exports.needs = {
  message_content: 'first',
  message_content_mini: 'first',
  avatar: 'first',
  avatar_name: 'first',
  avatar_link: 'first',
  message_action: 'map'
}

exports.gives = 'message_render'

function message_content_mini_fallback(msg)  {
  return h('code', msg.value.content.type)
}

exports.create = function (api) {

  function mini(msg, el) {
    var div = h('div.message.message--mini',
      h('div.row',
        h('div.avatar', api.avatar_link(msg.value.author, api.avatar_name(msg.value.author), ''), 
        h('span.message_content', el)),
        h('div.message_meta', timestamp(msg)) 
      )
    )
    return div
  }

  return function (msg, sbot) {
    var el = api.message_content_mini(msg)
    if(el) return mini(msg, el)

    var el = api.message_content(msg)
    if(!el) return mini(msg, message_content_mini_fallback(msg))

    var links = []
    for(var k in CACHE) {
      var _msg = CACHE[k]
      if(Array.isArray(_msg.content.mentions)) {
        for(var i = 0; i < _msg.content.mentions.length; i++)
          if(_msg.content.mentions[i].link == msg.key)
          links.push(k)
      }
    }

    var backlinks = h('div.backlinks')
    if(links.length)
      backlinks.appendChild(h('label', 'backlinks:', 
        h('div', links.map(function (key) {
          return messageLink(key)
        }))
      ))

    var msg = h('div.message',
      h('div.title.row',
        h('div.avatar', api.avatar(msg.value.author, 'thumbnail')),
        h('div.message_meta', getStars(msg), timestamp(msg))
      ),
      h('div.column',
        h('div.message_content.row', el),
        h('div.message_actions.row',
          h('div.actions', api.message_action(msg),
            h('a', {href: '#' + msg.key}, 'Reply')
          )
        )
      ),
      backlinks
    )
    return msg
  }
}


