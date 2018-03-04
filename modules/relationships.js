var pull = require('pull-stream')

var sbotQuery = require('./scuttlebot').query

//this is a bit crude, and doesn't actually show unfollows yet.

function makeQuery (a, b) {
  return {"$filter": {
      value: {
        author: a,
        content: {
          type: 'contact',
          contact: b,
          following: true
        }
      },
    }}
}


exports.gives = {
  follows: true,
  followers: true,
  follower_of: true
}

exports.create = function (api) {

  return {
    follows: function (id, cb) {
      return sbotQuery({query: [
        makeQuery(id, {$prefix:"@"}),
        {"$map": ['value', 'content', 'contact']}
      ]})
    },

    followers: function (id) {
      return sbotQuery({query: [
        makeQuery({$prefix:"@"}, id),
        {"$map": ['value', 'author']}
      ]})
    },

    follower_of: function (source, dest, cb) {
      pull(
        sbotQuery({query: [
          makeQuery(source, dest),
          {$map: ['value', 'content', 'following']}
        ]}),
        pull.collect(function (err, ary) {
          if(err) return cb(err)
          else cb(null, ary.pop()) //will be true, or undefined/false
        })
      )
    }
  }

}

