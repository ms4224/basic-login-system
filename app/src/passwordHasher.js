(function(){
// this module will do the following:
// For new passwords:
// 1.create a random salt.
// 2.prepend the salt to the password
// 3.hash the salt+password
// 4.store the salt and the hash in the database

// For checking existing password:
// 1.retrieve hash and salt from database.
// 2.prepend salt to inputted password.
// 3.hash the salt+password, and check if it matches the stored database hash

// this module will use hmac (hash with secret key), key is yolosauceoflegend24
'use strict';
var databaseService = require('./databaseService');
var crypto = require('crypto');
var synchronize = require('./synchronize');
var thunkify = require('./thunkConverter').thunkify;

//var storeNewHashedPassword = thunkify(databaseService.insertUsernameEmailHashSalt);
function newPassword(password, cb){
	synchronize.run(function*(){
		var hmac = crypto.createHmac('sha256', 'CHOOSE A KEY');
		var salt = generateSalt();
		hmac.update(salt + password);
		var hash = hmac.digest('hex');
		var result = {hash: hash, salt: salt};
		//yield storeNewHashedPassword(username, email, hash, salt); // this will be done in the signup service
		if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, result)};//return the salt and hash that have been generated
	})
}


function generateSalt(){
	//secret key for salt generator is salty beans
	var hmac = crypto.createHmac('sha256', 'CHOOSE A KEY');
	//hmac.update(Math.random().toString());//this is not cryptographically secure
	hmac.update(crypto.randomBytes(32).toString('hex'));//this is crypto strong!
	return hmac.digest('hex');
}

var retrieveHashSalt = thunkify(databaseService.getUsernameHashSalt)
function verifyPassword(username, password, cb){
	synchronize.run(function*(){
		var db_data = yield retrieveHashSalt(username);
		var hmac = crypto.createHmac('sha256', 'CHOOSE A KEY');
		hmac.update(db_data.salt + password);
		var checkHash = hmac.digest('hex');
		var valid = (checkHash === db_data.hash) ? true:false;
		if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, valid)};
	})
}

var testConfig = function(desiredDatabaseTestModule){//only call this if u are trying to test without the database
	databaseService.testConfig(desiredDatabaseTestModule);
}

var hashForTesting = function(word, salt){
	var hmac = crypto.createHmac('sha256', 'CHOOSE A KEY');
	hmac.update(salt + word);
	return hmac.digest('hex');
}

module.exports = {
	newPassword: newPassword,
	generateSalt: generateSalt,
	verifyPassword: verifyPassword,
	testConfig: testConfig,
	hashForTesting: hashForTesting
}

})();//end IIFE
