var h = require('hyperscript')
var pull = require('pull-stream')
var self_id = require('../keys')
var markdown = require('./helpers').markdown
var query = require('./scuttlebot').query

var getDesc = require('./simpleavatar').description
var getLoc = require('./simpleavatar').loc

exports.needs = {
  avatar_image: 'first',
  avatar_name: 'first',
  avatar_action: 'map'
}

exports.gives = 'avatar_profile'

exports.create = function (api) {
  return function (id) {

    if (id == self_id.id) {
      var edit = h('p', h('a', {href: '#Edit'}, h('button.btn.btn-primary', 'Edit profile')))
    } else { var edit = api.avatar_action(id)}

    var layout = h('div.column',
      h('div.message',
        api.avatar_image(id, 'profile'), 
        api.avatar_name(id),
        getLoc(id),
        getDesc(id),
        h('pre', h('code', id)),
        edit
      )
    )

    return layout
  }
}

