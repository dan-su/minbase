var pull = require('pull-stream')
var query = require('./scuttlebot').query
var h = require('hyperscript')
var markdown = require('./helpers').markdown

module.exports.name = function (id) {
  var name = h('span', id.substring(0, 10))

  pull(query({query: [{$filter: { value: { author: id, content: {type: 'about', about: id, name: {'$truthy': true}}}}}], reverse: true}),
    pull.drain(function (data){
      if(data.value.content.name) {
        var data = data.value.content.name
        name.textContent = '@' + data
    }
  }))
  return name
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
