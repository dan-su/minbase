var h = require('hyperscript')
var pull = require('pull-stream')
var self_id = require('../keys')
var markdown = require('./helpers').markdown
var query = require('./scuttlebot').query

exports.needs = {
  avatar_image: 'first',
  avatar_name: 'first',
  avatar_action: 'map'
}

exports.gives = 'avatar_profile'

exports.create = function (api) {

  return function (id) {
    var loco = h('p', '')
    var description = h('p', '')
 
    var edit

    console.log('id is: ' + id)
    console.log('self_id is: ' + self_id.id)

    if (id == self_id.id) {
      edit = h('p', h('a', {href: '#Edit'}, h('button.btn.btn-primary', 'Edit profile')))
    } else { edit = api.avatar_action(id)}

    pull(query({query: [{$filter: { value: { author: id, content: {type: 'loc'}}}}], limit: 1, reverse: true}),
    pull.drain(function (data){
      if(data.value.content.loc) { 
        loco.appendChild(h('span', h('strong', 'Location: '), data.value.content.loc))
      }
    }))

    pull(query({query: [{$filter: { value: { author: id, content: {type: 'description'}}}}], limit: 1, reverse: true}),
    pull.drain(function (data){
      if(data.value.content.description) {
        description.appendChild(h('span', h('strong', 'Description: '), markdown(data.value.content.description)))
      }
    }))

    return h('div.column',
      h('div.message',
        api.avatar_image(id, 'profile'), 
        api.avatar_name(id),
        loco,
        description,
        h('pre', h('code', id)),
        edit
      )/*,
      h('div.message',
        api.avatar_action(id)
      )*/
    )
  }
}

