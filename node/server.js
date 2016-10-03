var fs = require('fs');
var express = require('express');
var request = require('request');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
   res.send('Hello GET');
});

app.get('/requirements', function (req, res) {
    var resource = [
        //{
            //server: "https://cdn.mathjax.org",
            //module: "/mathjax/latest/MathJax.js",
            //query : "?config=TeX-AMS-MML_HTMLorMML",
        //}
        //{
            //server: "http://code.jquery.com",
            //module: "/jquery-1.10.2.min.js",
            //query : "",
        //}
        //, {
            //server: "http://code.jquery.com",
            //module: "/mobile/1.4.5/jquery.mobile-1.4.5.min.js",
            //query : "",
        //}
    ];
    for (var index = 0; index < resource.length; index++) {
        var object = resource[index];
        console.log(JSON.stringify(object));
        var remote = object.server + object.module + object.query;
        console.log(remote);
        request(remote).pipe(res);
    }
});

app.get('/jquery', function (req, res) {
    var server = "http://code.jquery.com";
    var jquery = "/jquery-1.10.2.min.js";
    var remote = server + jquery;
    request(remote).pipe(res);
});

app.get('/jquery.mobile', function (req, res) {
    var server = "http://code.jquery.com";
    var mobile = "/mobile/1.4.5/jquery.mobile-1.4.5.min.js";
    var remote = server + mobile;
    request(remote).pipe(res);
});

app.get('/client.html', function (req, res) {
    res.sendFile( __dirname + "/" + "client.html");
});

app.post('/', function (req, res) {
   res.send('Hello POST');
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});
