

//This module take in an HTTP request object, a pre-existing sessionID, and a pre-existing ip from database to verify if they are the same.
//returns true for same, false for not same.

(function(){
'use strict';

var sessionID_key = "sessionID";

function extract(req){//parse req.headers.cookie to retrieve the sessionID value
	var cookieArr = req.headers.cookie.split(';');
	var cookieSessionID;
	cookieArr.forEach(function(element){
		if (element.includes(sessionID_key)){
			var index = element.indexOf('=') +1;
			cookieSessionID = element.slice(index).replace(' ', '');
		}
	})
	if (cookieSessionID == undefined){
		cookieSessionID = 'no sessionID found';
	}
	return cookieSessionID;
}

function setSessionKey (string){//use this function if u need to change the session key, i.e. instead of "sessionID", something like "ID", or "session"
	sessionID_key = string;
}

module.exports = {
	extract: extract,
	setSessionKey: setSessionKey
}


})();//end IIFE