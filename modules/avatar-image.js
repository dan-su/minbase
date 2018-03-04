var getAvatar = require('ssb-avatar')
var h = require('hyperscript')
var ref = require('ssb-ref')
var path = require('path')
var visualize = require('visualize-buffer')
var pull = require('pull-stream')
var self_id = require('../keys').id
var query = require('./scuttlebot').query

var blobUrl = require('./helpers').bloburl

exports.gives = {
  avatar_image: true
}

function isFunction (f) {
  return 'function' === typeof f
}

var ready = false
var waiting = []

var last = 0

var cache = {}

exports.create = function (api) {
  var exports = {}
  var avatars  = {}
  pull(
    query({
      query: [{
        $filter: {
          timestamp: {$gt: last || 0 },
          value: { content: {
            type: "about",
            about: {$prefix: "@"},
            image: {$truthy: true}
        }}
      }},
      {
        $map: {
          id: ["value", "content", "about"],
          image: ["value", "content", "image"],
          by: ["value", "author"],
          ts: 'timestamp'
      }}],
      live: true
    }),
    pull.drain(function (a) {
      if(a.sync) {
        ready = true
        while(waiting.length) waiting.shift()()
        return
      }
      last = a.ts
      if (a.image && typeof a.image === 'object') a.image = a.image.link
      //set image for avatar.
      //overwrite another avatar
      //you picked.
      if(
        //if there is no avatar
          (!avatars[a.id]) ||
        //if i chose this avatar
          (a.by == self_id) ||
        //they chose their own avatar,
        //and current avatar was not chosen by me
          (a.by === a.id && avatars[a.id].by != self_id)
      )
        avatars[a.id] = a

    })
  )

  exports.avatar_image = function (author, classes) {
    classes = classes || ''
    if(classes && 'string' === typeof classes) classes = '.avatar--'+classes

    function gen (id) {
      if(cache[id]) return h('img', {src: cache[id]})
      var img = visualize(new Buffer(author.substring(1), 'base64'), 256)
      cache[id] = img.src
      return img
    }

    var img = ready && avatars[author] ? h('img', {src: blobUrl(avatars[author].image)}) : gen(author)

    ;(classes || '').split('.').filter(Boolean).forEach(function (c) {
      img.classList.add(c)
    })

    if(!ready)
      waiting.push(function () {
        if(avatars[author]) img.src = blobUrl(avatars[author].image)
      })

    return img
    
  }

  return exports
}

