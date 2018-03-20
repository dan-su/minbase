var pull = require('pull-stream')
var query = require('./scuttlebot').query
var h = require('hyperscript')
var markdown = require('./helpers').markdown
var visualize = require('visualize-buffer')

var config = require('../config')()

module.exports.name = function (id) {
  var name = h('span', id.substring(0, 10))

  pull(query({query: [{$filter: { value: { author: id, content: {type: 'about', about: id, name: {'$truthy': true}}}}}], reverse: true}),
    pull.collect(function (err, data){
      if(data[0]) {
        var data = data[0].value.content.name
        name.textContent = '@' + data
    }
  }))
  return name
}

var ref = require('ssb-ref')

module.exports.image = function (id) {
  var img = visualize(new Buffer(id.substring(1), 'base64'), 256)
  pull(query({query: [{$filter: { value: { author: id, content: {type: 'about', about: id, image: {'$truthy': true}}}}}], reverse: true}),
    pull.collect(function (err, data){
      if(data[0]) {
        console.log(data[0])
        if (ref.isBlob(data[0].value.content.image.link)) { 
          var data = config.blobsUrl + data[0].value.content.image.link
          console.log(data)
          img.src = data
        } else if (ref.isBlob(data[0].value.content.image)) {
          var data = config.blobsUrl + data[0].value.content.image
          console.log(data)
          img.src = data
        }
      }
    })
  )

  return img
}

module.exports.loc = function (id) {
  var loc = h('span.loc')

  pull(query({query: [{$filter: { value: { author: id, content: {type: 'loc'}}}}], limit: 100, reverse: true}),
   pull.collect(function (err, data){
      if(data[0]) {
        var data = markdown(data[0].value.content.loc)
        loc.appendChild(data)
      }
    })
  )
  return loc
}

module.exports.description = function (id) {
  var desc = h('span.desc')

  pull(query({query: [{$filter: { value: { author: id, content: {type: 'description', about: id}}}}], limit: 100, reverse: true}),
    pull.collect(function (err, data){
      if(data[0]) {
        var data = markdown(data[0].value.content.description)
        desc.appendChild(data)
      }
    })
  )
  return desc
}

