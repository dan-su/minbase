var h = require('hyperscript')
var u = require('../util')
var pull = require('pull-stream')
var Scroller = require('pull-scroll')

var config = require('../config')().config

exports.gives = {
  screen_view: true
}

exports.create = function (api) {
  return {
    screen_view: function (path, sbot) {
      if(path === 'Key') {
        var importKey = h('textarea.import', {placeholder: 'Import a new public/private key', name: 'textarea', style: 'width: 97%; height: 100px;'})
        var content = h('div.column.scroller__content')
        var div = h('div.column.scroller',
          {style: {'overflow':'auto'}},
          h('div.scroller__wrapper',
            h('div.column.scroller__content',
              h('div.message',
                h('h1', 'Your Key'),
                h('p', {innerHTML: 'Your public/private key is: <pre><code>' + localStorage[config.caps.shs + '/secret'] + '</code></pre>'},
                  h('button.btn.btn-danger', {onclick: function (e){
                    localStorage[config.caps.shs +'/secret'] = ''
                    alert('Your public/private key has been deleted')
                    e.preventDefault()
                    location.hash = ""
                    location.reload()
                  }}, 'Delete Key')
                ),
                h('hr'),
                h('form',
                  importKey,
                  h('button.btn.btn-success', {onclick: function (e){
                    if(importKey.value) {
                      localStorage[config.caps.shs + '/secret'] = importKey.value.replace(/\s+/g, ' ')
                      e.preventDefault()
                      alert('Your public/private key has been updated')
                    }
                    location.hash = ""
                    location.reload()
                  }}, 'Import key'),
                )
              )
            )
          )
        )
        return div
      }
    }
  }
}

