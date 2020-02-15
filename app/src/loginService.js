(function(){
'use strict';
var synchronize = require('./synchronize');
var thunkify = require('./thunkConverter').thunkify;
var databaseService = require('./databaseService');
var extractSessionID = require('./sessionIDcookieExtractor').extract;
var passwordHasher = require('./passwordHasher');
//thunkify necessary async utilities
var verifyPassword = thunkify(passwordHasher.verifyPassword);
var getSessionData_fromDB = thunkify(databaseService.getSessionUsernameIP);


function checkRequest(req, cb){//takes an http request object that has used express-formidable, access username+pass thru req.fields.username and req.fields.password
	synchronize.run(function*(){
		var valid = yield verifyPassword(req.fields.username, req.fields.password);
		if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, valid)}
	})
}


function checkSession(req, cb){
	synchronize.run(function*(){
		var valid = false;
		if (typeof(req.headers.cookie) === "string"){//make sure cookie is a string to avoid bug in extract SessionID
			var sessionID_fromCookie = extractSessionID(req);
			var sessionData_fromDB = yield getSessionData_fromDB(sessionID_fromCookie);
			valid = ((sessionData_fromDB.sessionID == sessionID_fromCookie)&&(sessionData_fromDB.ip == req.ip)) ? true : false;//if sessionID exists from the query and ips match, return true, else false
		}
		if((cb!=undefined)&&(typeof(cb)==='function')){cb (null, valid)};
	})
}

function testConfig(fakeDatabaseConnectModule){
	databaseService.testConfig(fakeDatabaseConnectModule);
}

module.exports = {
	checkRequest : checkRequest,
	checkSession : checkSession,
	testConfig : testConfig
}

})();//end IIFE