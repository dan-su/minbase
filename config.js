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
  var remote = config.address
  var blobsUrl = host + '/blobs/get'

  return {
    config: config,
    remote: remote,
    blobsUrl: blobsUrl
  }
}


