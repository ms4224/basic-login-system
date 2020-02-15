//This module serves to store a new user's username/password/email.
//it also should check whether the username and/or email is already taken.

//there will be three functions
// 1.check username - verify username is available
// 2.check email - verify email is available
// 3.signup - store provided username, email, and password (hash+salt). for redundancy, after inserting it, the method will also verify it was stored correctly by doing a select on the database for the specified username

//the input will be an http req object.(modified by express-formidable), so access to fields will be through req.fields.username, password, email
//the output will be a boolean - true indicates signup was successful, and username password email were stored in database.  
//false indicates that the 
(function(){
'use strict';

var databaseService = require('./databaseService')
var synchronize = require('./synchronize');
var thunkify = require('./thunkConverter').thunkify;
var passwordHasher = require('./passwordHasher');


var newPassword = thunkify(passwordHasher.newPassword);
var storeUserCreds = thunkify(databaseService.insertUsernameEmailHashSalt);
var getUserCreds =  thunkify(databaseService.getUsernameHashSalt);
var getUserCredsByEmail = thunkify(databaseService.getUserCredsByEmail);
function signup(req,cb){
		synchronize.run(function*(){
			var passElements = yield newPassword(req.fields.password);
			var salt = passElements.salt;  var hash = passElements.hash;
			yield storeUserCreds(req.fields.username, req.fields.email, hash, salt);
			var result = yield getUserCreds(req.fields.username);
			var valid = false;
			if (req.fields.username === result.username && req.fields.email === result.email && hash === result.hash && salt === result.salt){
				valid = true;
			}
			if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, valid)};
		})
}

function checkUsername(req,cb){
	synchronize.run(function*(){
		var dbData = yield getUserCreds(req.fields.username);
		var available = false;
		if (dbData.username == undefined){
			available = true;
		}
		if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, available)};
	})
}

function checkEmail(req,cb){
	synchronize.run(function*(){
		var dbData = yield getUserCredsByEmail(req.fields.email);
		var available = false;
		if (dbData.username == undefined){
			available = true;
		}
		if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, available)};
	})
}

var testConfig = function(desiredDatabaseTestModule){//only call this if u are trying to test without the database
	databaseService.testConfig(desiredDatabaseTestModule);
}






module.exports = {
	signup: signup,
	checkUsername: checkUsername,
	checkEmail: checkEmail,
	testConfig: testConfig
}

})();//end IIFE