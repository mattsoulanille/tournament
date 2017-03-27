"use strict";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const port = 8000;
var fs = require('fs');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));
http.listen(port, function() {
    console.log("Server on port", port);
});

var bracket;


io.on('connection', function(client) {
    fs.readFile("bracket.json", function(err, data) {
	if (err) throw err;
	bracket = JSON.parse(data);
    });
    
    client.emit("onConnected", bracket);

    client.on('bracket', function(data) {
//	console.log("test");
	//	console.log(json);
	bracket = data;
	let json = JSON.stringify(data);
	fs.writeFile("bracket.json", json, function(err) {
	    if (err) {
		console.log(err);
	    }
	});

	client.broadcast.emit('update', bracket);
    });
    //client.broadcast.emit('test', "asdfasdf");
});
