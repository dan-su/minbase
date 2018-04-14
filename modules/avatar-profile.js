var h = require('hyperscript')
var pull = require('pull-stream')
var self_id = require('../keys')
var markdown = require('./helpers').markdown
var query = require('./scuttlebot').query
var avatar = require('./avatar')

exports.gives = 'avatar_profile'

exports.needs = {avatar_action: 'first'}

exports.create = function (api) {
  return function (id) {

    if (id == self_id.id) {
      var edit = h('p', h('a', {href: '#Edit'}, h('button.btn.btn-primary', 'Edit profile')))
    } else { var edit = api.avatar_action(id)} 

    var layout = h('div.column',
      h('div.message',
        h('div.avatar--profile', avatar.image(id, 'profile')),
        h('a', {href: '#' + id}, avatar.name(id)),
        avatar.loc(id),
        avatar.description(id),
        h('pre', h('code', id)),
        edit
      )
    )

    return layout
  }
}

