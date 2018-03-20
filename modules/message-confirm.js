var lightbox = require('hyperlightbox')
var h = require('hyperscript')
var u = require('../util')
var self_id = require('../keys').id
var publish = require('./helpers-private').publish

exports.needs = {
  message_content: 'first', 
  message_render: 'first'
}

exports.gives = 'message_confirm'

exports.create = function (api) {
  return function (content, cb) {

    cb = cb || function () {}

    var lb = lightbox()
    document.body.appendChild(lb)

    var msg = {
      key: "DRAFT",
      value: {
        author: self_id,
        previous: null,
        sequence: null,
        timestamp: Date.now(),
        content: content
      }
    }

    var okay = h('button.btn.btn-primary', 'Publish', {onclick: function () {
      lb.remove()
      publish(content, cb)
    }})

    var cancel = h('button.btn', 'Cancel', {onclick: function () {
      lb.remove()
      cb(null)
    }})

    lb.show(
      h('div.column.message-confirm',
        api.message_render(msg),
        h('div.row.message-confirm__controls', okay, cancel)
      )
    )

    okay.focus()
  }
}

