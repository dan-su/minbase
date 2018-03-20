var emojiNames = require('./helpers').emojinames

var config = require('../config')

exports.gives = 'suggest_mentions'

exports.create = function (api) {

  return function (word) {
    return function (cb) {
      if (word[0] !== ':' || word.length < 2) return cb()
      word = word.substr(1)
      if (word[word.length-1] === ':') word = word.substr(0, word.length-1)
      cb(null, emojiNames().filter(function (name) {
        return name.substr(0, word.length) === word
      }).slice(0, 50).map(function (emoji) {
        return {
          image: config.emojiUrl + emoji,
          title: emoji,
          subtitle: emoji,
          value: ':' + emoji + ':'
        }
      }))
    }
  }

}
