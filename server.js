var express = require('express')
var request = require('request')
var app = express();

app.set('ipaddress', (process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0"))
app.set('port', (process.env.OPENSHIFT_NODEJS_PORT || 5000))

app.get('/', function(req, res) {
  res.send('This is just a proxy for transifex.')
})

function transifexResponse(url, res) {
  res.setHeader('Content-Type', 'text/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  var options = {
    url: url,
    method: 'GET',
    headers: { 'Authorization': 'Basic YnVnZ2k6YnVnbWVub3Q=' }, // "buggi:bugmenot" in base64
  }
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body)
    } else {
      res.send('error')
    }
  })
}

app.get("/resource", function(req, res) {
  var url = 'http://www.transifex.com/api/2/project/darkwallet/resource/darkwallet/?details';
  transifexResponse(url, res);
})

app.get("/:lang.json", function(req, res) {
  var lang = req.param("lang")
  var url = 'https://www.transifex.com/api/2/project/darkwallet/resource/darkwallet/translation/'+lang+'/?file';
  transifexResponse(url, res);
});

app.listen(app.get('port'), app.get('ipaddress'), function() {
  console.log("Node app is running at " + app.get('ipaddress') + ":" + app.get('port'))
})
