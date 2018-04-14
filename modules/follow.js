var h = require('hyperscript')
var u = require('../util')
var pull = require('pull-stream')
var avatar = require('./avatar')

//render a message when someone follows someone,
//so you see new users
function isRelated(value, name) {
  return value ? name : value === false ? 'un'+name : ''
}

exports.needs = {
  message_confirm: 'first',
  follower_of: 'first'
}

exports.gives = {
  message_content_mini: true,
  avatar_action: true,
}

exports.create = function (api) {
  exports.message_content_mini = function (msg) {
    var content = msg.value.content
    if(content.type == 'contact' && msg.value.content.contact) {
      var relation = isRelated(msg.value.content.following, 'follows')
      if(msg.value.content.blocking) relation = 'blocks'
      return [
        relation, ' ',
        h('a', {href: '#' + msg.value.content.contact}, avatar.name(msg.value.content.contact))
      ]
    }
  }

  /*exports.message_content = function (msg) {

    var content = msg.value.content
    if(content.type == 'contact' && content.contact) {
      var relation = isRelated(content.following, 'follows')
      if(content.blocking) relation = 'blocks'
      return h('div.contact', relation, h('a', {href: msg.value.content.contact}, api.avatar(msg.value.content.contact, 'thumbnail')))
    }
  }*/

  exports.avatar_action = function (id) {
    var follows_you, you_follow

    var self_id = require('../keys').id
    api.follower_of(self_id, id, function (err, f) {
      you_follow = f
      update()
    })
    api.follower_of(id, self_id, function (err, f) {
      follows_you = f
      update()
    })

    var state = h('label')
    var label = h('span')

    function update () {
      state.textContent = (
        follows_you && you_follow ? 'Friend'
      : follows_you               ? 'Follower'
      : you_follow                ? 'Following'
      :                             ''
      )

      label.textContent = you_follow ? 'Unfollow' : 'Follow'
    }

    return h('a', {href:'#', onclick: function (e) {
        e.preventDefault()
        api.message_confirm({
          type: 'contact',
          contact: id,
          following: !you_follow
        }, function (err, msg) {
          if (err) return console.error(err)
          you_follow = msg.value.content.following
          update()
        })
      }}, h('button.btn', label))
  }
  return exports
}
