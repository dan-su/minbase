var ref = require('ssb-ref')
var Scroller = require('pull-scroll')
var h = require('hyperscript')
var pull = require('pull-stream')
var u = require('../util')
var userstream = require('./scuttlebot').userstream

exports.needs = {
  message_render: 'first',
  avatar_profile: 'first'
}

exports.gives = 'screen_view'

exports.create = function (api) {

  return function (id) {
    if(ref.isFeed(id)) {

      var content = h('div.column.scroller__content')
      var div = h('div.column.scroller',
        {style: {'overflow':'auto'}},
        h('div.scroller__wrapper',
          h('div.scroller__content', api.avatar_profile(id)),
          content
        )
      )

      /*api.signifier(id, function (_, names) {
        if(names.length) div.title = names[0].name
      })*/

      pull(
        userstream({id: id, old: false, live: true}),
        Scroller(div, content, api.message_render, true, false)
      )

      pull(
        u.next(userstream, {
          id: id, reverse: true,
          limit: 50, live: false
        }, ['value', 'sequence']),
        //pull.through(console.log.bind(console)),
        Scroller(div, content, api.message_render, false, false)
      )

      return div
    }
  }
}

