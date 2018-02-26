var h = require('hyperscript')
var human = require('human-time')

module.exports.timestamp = function (msg) {
  // this function renders a human-readable timestamp and updates it once in awhile

  function updateTimestampEl(el) {
    el.firstChild.nodeValue = human(new Date(el.timestamp))
    return el
  }
  
  setInterval(function () {
    var els = [].slice.call(document.querySelectorAll('.timestamp'))
    els.forEach(updateTimestampEl)
  }, 60e3)  

  var timestamp = updateTimestampEl(h('a.enter.timestamp', {
    href: '#'+msg.key,
    timestamp: msg.value.timestamp,
    title: new Date(msg.value.timestamp)
  }, ''))

  return timestamp
}

var host = window.location.origin

module.exports.bloburl = function (link) {
  // this function returns the url where you'll find ssb blobs 

  if('string' == typeof link.link)
    link = link.link

  var blobUrl = host + '/blobs/get/' + link

  return blobUrl
}

var emojis = require('emoji-named-characters')

module.exports.emojinames = function () {
  var emojiNames = Object.keys(emojis)
  return emojiNames
}

var blobUrl = require('./helpers').bloburl

module.exports.emojiurl = function (emoji) {
  return emoji in emojis &&
    blobUrl(emoji).replace(/\/blobs\/get/, '/img/emoji') + '.png'
    //host + '/img/emoji/' + emoji + '.png'
}
