(function(){
'use strict';

var databaseService = require('./databaseService')
var synchronize = require('./synchronize');
var thunkify = require('./thunkConverter').thunkify;
var passwordHasher = require('./passwordHasher');

//thunked methods
var newPassword = thunkify(passwordHasher.newPassword);
var updatePasswordDb = thunkify(databaseService.updatePassword);
var updateEmailDb = thunkify(databaseService.updateEmail);
var getUserCreds =  thunkify(databaseService.getUsernameHashSalt);



function updatePassword (req, cb){//yields a true value if it password is changed successfully
	synchronize.run(function*(){
		var passElements = yield newPassword(req.fields.newPassword);
		var salt = passElements.salt;  var hash = passElements.hash;
		yield updatePasswordDb(req.fields.username, hash, salt);
		var valid = false;
		//double check it was stored correctly
		var result = yield getUserCreds(req.fields.username);
		if (req.fields.username === result.username && hash === result.hash && salt === result.salt){
				valid = true;
			}
		if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, valid)};
	})
}

function updateEmail (req, cb){//yields a true value if email is changed successfully
	synchronize.run(function*(){
		yield updateEmailDb(req.fields.username, req.fields.newEmail);
		var valid = false;
		//double check the update went through
		var result = yield getUserCreds(req.fields.username);
		if (req.fields.username === result.username && result.email === req.fields.newEmail){
			valid = true;
		}
		if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, valid)};
	})
}

var testConfig = function(desiredDatabaseTestModule){//only call this if u are trying to test without the database
	databaseService.testConfig(desiredDatabaseTestModule);
}

module.exports = {
	updatePassword: updatePassword,
	updateEmail: updateEmail,
	testConfig: testConfig
}

})();//end IIFE