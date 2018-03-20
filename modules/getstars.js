var h = require('hyperscript')

var config = require ('../config')()

module.exports.getstars = function (msg, sbot) {
  var star = config.emojiUrl + 'star.png'
  var digs = h('a')

  var votes = []
  for(var k in CACHE) {
    if (CACHE[k].content.vote != null) {
      if(CACHE[k].content.type == 'vote' &&
      (CACHE[k].content.vote == msg.key ||
      CACHE[k].content.vote.link == msg.key
      ))
      votes.push({source: CACHE[k].author, dest: k, rel: 'vote'})
    }
  }
  var digs
  for (i = 0; i < votes.length; i++) {
    digs = '<img src="' + star + '" class="emoji">' + digs
  }
  return h('span', {innerHTML: digs})
}

