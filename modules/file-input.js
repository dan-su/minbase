var h = require('hyperscript')
var pull = require('pull-stream')
var mime = require('simple-mime')('application/octect-stream')
var split = require('split-buffer')
var addblob = require('./scuttlebot').blobs_add

module.exports = {
  gives: 'file_input',
  create: function (api) {
    return function FileInput(onAdded) {
      return h('label.btn', 'Upload file',
        h('input', { type: 'file', hidden: true,
        onchange: function (ev) {
          var file = ev.target.files[0]
          if (!file) return
          var reader = new FileReader()
          reader.onload = function () {
            pull(
              pull.values(split(new Buffer(reader.result), 64*1024)),
              addblob(function (err, blob) {
                if(err) return console.error(err)
                onAdded({
                  link: blob,
                  name: file.name,
                  size: reader.result.length || reader.result.byteLength,
                  type: mime(file.name)
                })
              })
            )
          }
          reader.readAsArrayBuffer(file)
        }
      }))
    }
  }
}

