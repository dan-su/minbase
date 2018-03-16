var h = require('hyperscript')
var u = require('../util')
var pull = require('pull-stream')
var emojiUrl = require('./helpers').emojiurl
var messageLink = require('./helpers').message_link

exports.needs = {
  message_confirm: 'first'
}

exports.gives = {
  message_content_mini: true,
  message_action: true
}

exports.create = function (api) {
  exports.message_content_mini = function (msg, sbot) {
    var star = emojiUrl('star')
    var stars = emojiUrl('stars')
    if(msg.value.content.type !== 'vote') return
    var link = msg.value.content.vote.link
    return [
        msg.value.content.vote.value > 0 
        ? h('img', {className: 'emoji', src: star}) 
        : h('img', {className: 'emoji', src: stars}),
        ' ', messageLink(link)
      ]
  }

  exports.message_action = function (msg, sbot) {
    var star = emojiUrl('star')
    if(msg.value.content.type !== 'vote')
      return h('a.dig', {href: '#', onclick: function (e) {
        e.preventDefault()
        var dig = {
          type: 'vote',
          vote: { link: msg.key, value: 1, expression: 'Star' }
        }
        if(msg.value.content.recps) {
          dig.recps = msg.value.content.recps.map(function (e) {
            return e && typeof e !== 'string' ? e.link : e
          })
          dig.private = true
        }
        api.message_confirm(dig)
      }}, h('img', {className: 'emoji', src: star}))

  }
  return exports
}

