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


var sbot = require('./scuttlebot.js')
var ref = require('ssb-ref')

module.exports.message_name = function (id, cb) {
  // gets the first few characters of a message, for message-link
  function title (s) {
    var m = /^\n*([^\n]{0,40})/.exec(s)
    return m && (m[1].length == 40 ? m[1]+'...' : m[1])
  }

  sbot.get(id, function (err, value) {
    if(err && err.name == 'NotFoundError')
      return cb(null, id.substring(0, 10)+'...(missing)')
    if(value.content.type === 'post' && 'string' === typeof value.content.text)
      return cb(null, title(value.content.text))
    else if('string' === typeof value.content.text)
      return cb(null, value.content.type + ':'+title(value.content.text))
    else
      return cb(null, id.substring(0, 10)+'...')
  })
}

var messageName = exports.message_name

module.exports.message_link = function (id) {
  // generates a link to a message that has been replied to
  if('string' !== typeof id)
    throw new Error('link must be to message id')

  var link = h('a', {href: '#'+id}, id.substring(0, 10)+'...')

  if(ref.isMsg(id))
    messageName(id, function (err, name) {
      if(err) console.error(err)
      else link.textContent = name
    })

  return link
}

var markdown = require('ssb-markdown')
//var h = require('hyperscript')
//var ref = require('ssb-ref')
var blobUrl = exports.bloburl
var emojiUrl = exports.emojiurl

module.exports.markdown = function (content) {
 function renderEmoji(emoji) {
    var url = emojiUrl(emoji)
    if (!url) return ':' + emoji + ':'
    return '<img src="' + encodeURI(url) + '"'
      + ' alt=":' + escape(emoji) + ':"'
      + ' title=":' + escape(emoji) + ':"'
      + ' class="emoji">'
  }
 
  if('string' === typeof content)
      content = {text: content}
    //handle patchwork style mentions.
    var mentions = {}

    var md = h('div.markdown')
    md.innerHTML = markdown.block(content.text, {
      emoji: renderEmoji,
      toUrl: function (id) {
        if(ref.isBlob(id)) return blobUrl(id)
        return '#'+(mentions[id]?mentions[id]:id)
      }
    })

    return md
}
