var pull = require('pull-stream')
var query = require('./scuttlebot').query
var h = require('hyperscript')

module.exports.name = function (id) {
  console.log('getting: ' + id)
  pull(query({query: [{$filter: { value: { author: id, content: {type: 'name', about: id, name: {'$truthy': true}}}}}], limit: 1, reverse: true}),
    pull.drain(function (data){
      if(data.value.content.name) {
        console.log(name)
    }
  }))
}

module.exports.image = function (id) {
  
}

module.exports.loc = function (id) {
  var loc = h('span.loc')

  pull(query({query: [{$filter: { value: { author: id, content: {type: 'loc'}}}}], limit: 1, reverse: true}),
   pull.drain(function (data){
      if(data.value.content.loc) {
        var data = markdown(data.value.content.loc)
        loc.appendChild(data)
      }
    })
  )
  return loc
}

var markdown = require('./helpers').markdown

module.exports.description = function (id) {
  var desc = h('span.desc')

  pull(query({query: [{$filter: { value: { author: id, content: {type: 'description', about: id}}}}], limit: 1, reverse: true}),
    pull.drain(function (data){
      if(data.value.content.description) {
        var data = markdown(data.value.content.description)
        desc.appendChild(data)
      }
    })
  )
  return desc
}
