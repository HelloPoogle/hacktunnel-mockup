// Node.js application
//
// Setup:
// npm install
// gulp
//
// Run:
// node tls.js
var express = require('express');
var https = require('https');
var fs = require('fs');

var app = express();

var key = fs.readFileSync('./tls.key');
var cert = fs.readFileSync('./tls-cert.pem');

app.use(express.static('build'));

var srv = https.createServer({key:key, cert: cert}, app);
srv.listen(3000);

