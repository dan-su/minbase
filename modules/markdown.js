var markdown = require('ssb-markdown')
var h = require('hyperscript')
var ref = require('ssb-ref')
var blobUrl = require('./helpers').bloburl
var emojiUrl = require('./helpers').emojiurl

exports.gives = 'markdown'

exports.create = function (api) {

  function renderEmoji(emoji) {
    var url = emojiUrl(emoji)
    if (!url) return ':' + emoji + ':'
    return '<img src="' + encodeURI(url) + '"'
      + ' alt=":' + escape(emoji) + ':"'
      + ' title=":' + escape(emoji) + ':"'
      + ' class="emoji">'
  }

  return function (content) {
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
}

