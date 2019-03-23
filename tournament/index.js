"use strict";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const port = 8000;
var fs = require('fs');
var Promise = require('bluebird');


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/:bracket', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));
http.listen(port, function() {
    console.log("Server on port", port);
});

var bracket;
var bracketPath = "brackets";

io.on('connection', function(client) {
    client.on("room", function(room) {
	var path = bracketPath + room + ".json";
	client.join(path);

    
	if (!fs.existsSync(path)) {
	    console.log("Creating new bracket at " + path);
	    copyFile('template.json', path)
		.then(function() {
 		    fs.readFile(path, function(err, data) {
			if (err) throw err;
			bracket = JSON.parse(data);
			client.emit("onConnected", bracket);
		    });
		});
	}
	else {
	    fs.readFile(path, function(err, data) {
		if (err) throw err;
		bracket = JSON.parse(data);
		client.emit("onConnected", bracket);
	    });
	}
	
	
	
	client.on('bracket', function(data) {
	    //	console.log("test");
	    //	console.log(json);
	    bracket = data;
	    let json = JSON.stringify(data);
	    fs.writeFile(path, json, function(err) {
		if (err) {
		    console.log(err);
		}
	    });
	    
	    client.broadcast.to(path).emit('update', bracket);
	});
	//client.broadcast.emit('test', "asdfasdf");
    });
});





function copyFile(source, target) {
    return new Promise(function(resolve, reject) {
	var rd = fs.createReadStream(source);
	rd.on("error", function(err) {
	    reject(err);
	});
	var wr = fs.createWriteStream(target);
	wr.on("error", function(err) {
	    reject(err);
	});
	wr.on("close", function(ex) {
	    resolve();
	});
	rd.pipe(wr);
    });
}
