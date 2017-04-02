"use strict";

var socket = io();
var room = window.location.pathname;




function shuffleBracket() {
    var ask = confirm("Are you sure you want to shuffle the bracket?");
    if (ask) {
	var toShuffle = []
	bracketData.teams.forEach(function(item) {
	    toShuffle.push(item[0]);
	    toShuffle.push(item[1]);
	});
	
	shuffle(toShuffle);
	
	var newTeams = [];
	for (var i = 0; i < toShuffle.length; i+= 2) {
	    var pairing = [toShuffle[i], toShuffle[i+1]];
	    if (pairing[1] == undefined) {
		pairing[1] = null;
	    }
	    newTeams.push(pairing);
	}
	bracketData.teams = newTeams;
	setBracket(bracketData);
    }
    
}


/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items The array containing the items.
 */
// Copy pasta
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

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
var bracketData;
let setBracket = function(data) {
    bracketData = data;
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
    bracketData = data;
    socket.emit('bracket', data)
};


window.onbeforeunload = function() {
    socket.disconnect();

}


