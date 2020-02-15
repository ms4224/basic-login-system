(function(){//this module not only needs to generate a random key, but it also needs to check the database to make sure it doesn't already exist!!

var crypto = require('crypto');
var databaseService = require('./databaseService')
var thunkify = require('./thunkConverter').thunkify;
var synchronize = require('./synchronize');


var getSessionData = thunkify(databaseService.getSessionUsernameIP);
var insertNewSessionData = thunkify(databaseService.insertSessionUsernameIP);
var deleteSessionIDBasedOnUser = thunkify(databaseService.deleteSessionIDBasedOnUser)

var generate_key = function(req, cb){//generates a hash, checks if it is unique, and repeats until it is unique.//then stores a new session and sets it to delete after expiry time
	synchronize.run(function* (){
		var key;
		var unique = false;
		while (!unique) {
		 	key = generate_random_ID();
		 	var sessionData = yield getSessionData(key);
		 	unique = (sessionData.sessionID == undefined) ? true : false;
		}
		//insert unique key and credentials into sessions table of database
		yield insertNewSessionData(key, req.fields.username, req.ip);
		deleteSessionAfterSomeTime(key, 60000*25)//set to 25mins to delete the session (session expired)
		if(typeof(cb)==='function' && cb!= undefined){cb(null, key)};
	})
}

var generate_random_ID = function() {
    var hash = crypto.createHash('sha256');
    hash.update(Math.random().toString());
    return hash.digest('hex');
};

var deleteSessionAfterSomeTime = function(key, time){
	setTimeout(function(){
		databaseService.deleteSessionData(key);
		console.log('session with the following key has been deleted: ', key);
	}, time)
}

var deleteExistingSessionID = function(req, cb){
	synchronize.run(function*(){
		yield deleteSessionIDBasedOnUser(req.fields.username);
		if (typeof(cb)==='function' && cb!= undefined){cb(null, null)};
	})
}

var testConfig = function(desiredDatabaseTestModule){//only call this if u are trying to test without the database
	databaseService.testConfig(desiredDatabaseTestModule);
	deleteSessionAfterSomeTime = function(){};
}

module.exports = {
	generate_key : generate_key,
	testConfig: testConfig,
	deleteExistingSessionID: deleteExistingSessionID
}



})();//end IIFE