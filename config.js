var http = require('http')

module.exports = function () {
  if (localStorage.host) 
    var host = localStorage.host
  else
    var host = window.location.origin

  console.log(host)

  http.get(host + '/get-config', function (res) {
    res.on('data', function (data, remote) {
      config = data
      localStorage[host] = config
    })
  })

  var config = JSON.parse(localStorage[host])
  var blobsUrl = host + '/blobs/get'

  if (config.ws.remote)
    var remote = config.ws.remote
  else
    var remote = config.address

  return {
    config: config,
    remote: remote,
    blobsUrl: blobsUrl
  }
}


