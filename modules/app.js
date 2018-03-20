var h = require('hyperscript')
var id = require('../keys').id

var avatar = require('./avatar')

module.exports = {
  needs: {
    screen_view: 'first'
  },
  gives: 'app',

  create: function (api) {
    return function () {
      document.head.appendChild(h('style', require('../style.css.json')))

      function hash() {
        return window.location.hash.substring(1)
      }

      var view = api.screen_view(hash() || 'Public')

      var screen = h('div.screen.column', view)

      window.onhashchange = function (ev) {
        var _view = view
        view = api.screen_view(hash() || 'Public')
        if(_view) screen.replaceChild(view, _view)
        else document.body.appendChild(view)
      }

      document.body.appendChild(screen)

      var search = h('input.search', {placeholder: 'Search'})

      document.body.appendChild(h('div.navbar',
        h('div.internal', 
          //h('li', h('a', {href: '#' + id}, api.avatar_image(id, 'tiny'))),
          h('li', h('a', {href: '#' + id}, avatar.name(id))),
          h('li', h('a', {href: '#'}, 'Public')),
          h('li', h('a', {href: '#Private'}, 'Private')),
          h('li', h('a', {href: '#Mentions'}, 'Mentions')),
          h('li', h('a', {href: '#Key'}, 'Key')),
          h('form.search', { onsubmit: function (e) {
              //if (err) throw err 
              window.location.hash = '?' + search.value
              e.preventDefault()
            }},
            search,
            h('button.btn.btn-primary.btn-search', 'Search')
          )
        )
      ))
    }
  }
}


