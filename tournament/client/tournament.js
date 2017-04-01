"use strict";

var socket = io();
var room = window.location.pathname;

/*
var xmlhttp = new XMLHttpRequest();
xmlhttp.open('GET', '/bracket.json', true);
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {
	    var data = JSON.parse(xmlhttp.responseText);

	    $(function() {
		$('.bracket').bracket({
		    init: data, // data to initialize the bracket with 
		    save: onSave
	    	    
		});
	    });
         }
    }
};
*/
// Would be nice but if a client reconnects without reloading, there are problems

//xmlhttp.send(null);

var bracket;
let setBracket = function(data) {
    $('.jQBracket').remove(); // Disgusting code. Just Disgusting
    $(function() {
	bracket = $('.bracket').bracket({
	    init: data, // data to initialize the bracket with 
	    save: onSave
	    
	});
    });
}


socket.on("connect", function() {
    socket.emit('room', room);
});

socket.on("onConnected", setBracket);


socket.on("update", setBracket);


socket.on('test', function(data) {
    console.log(data);
});


var onSave = function(data) {
    socket.emit('bracket', data)
};


window.onbeforeunload = function() {
    socket.disconnect();

}


