(function(){
'use strict'

var crypto = require('crypto');
var synchronize = require('./synchronize')
var passwordHasher = require('./passwordHasher');
var thunkify = require('./thunkConverter').thunkify;
var nodemailer = require('nodemailer');
var databaseService = require('./databaseService');

//thunked functions
var generate_temp_data = thunkify(generateTempPasswordData);
var emailTempCreds = thunkify(sendEmail);
var getUserCreds = thunkify(databaseService.getUsernameHashSalt);
var deleteTempCredsByUsername = thunkify(databaseService.deleteTempPasswordInfoByUsername);
var storeTempCreds = thunkify(databaseService.insertTempPasswordInfo);

// forgotPasswordService
// 1.check if username exists in database, grab email
// 2.generate new password, hash, salt, and routeKey
// 3.0. delete any entry into temporary_user_password table that is associated with username
// 3.store username, new password, hash, salt and routekey in temporary_user_password table.
// 4.set temporary_user_password table entry with specified routeKey to delete itself in x mins
// 5.email user with the following: username, new password, link-to-reset-password (includes routekey as a parameter)
function sendResetLink(username, cb){
	synchronize.run(function*(){
		var userCreds = yield getUserCreds(username);
		if (userCreds.username === undefined){
			if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, false)};//if username does not exist in db, send a false
		}
		else{
			var tempPasswordData = yield generate_temp_data(username);
			yield deleteTempCredsByUsername(username);
			yield storeTempCreds(userCreds.username, tempPasswordData.temp_password, tempPasswordData.temp_hash, tempPasswordData.temp_salt, tempPasswordData.routekey);
			setTimeout(function(){
				databaseService.deleteTempPasswordInfoByRoutekey(tempPasswordData.routekey);
				console.log('sent delete command to delete temporary password data due to time out for: '+tempPasswordData.routekey+" with username: "+username)
			}, 1000*60*30)//delete the temporary data in 30 mins
			var valid = yield emailTempCreds(userCreds.username, tempPasswordData.temp_password, tempPasswordData.routekey, userCreds.email);
			if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, valid)};//at this point, if the email sending failed, send a false
		}
	})
}

function generateTempPasswordData(username, cb){//based off a username, generates a temp_password, associated hash and salt, and a routekey
	var newPassword = thunkify(passwordHasher.newPassword);
	synchronize.run(function*(){
		//create random password
		var tempPassword_hmac = crypto.createHmac('sha256', 'temp_password_of_legend'+username);
		tempPassword_hmac.update(username+crypto.randomBytes(32).toString('hex'));
		var temp_password = tempPassword_hmac.digest('hex');
		//get salt and hash of temp_password from passwordHasher module
		var hashed_data = yield newPassword(temp_password);
		//create random routekey
		var routekey_hmac = crypto.createHmac('sha256', username);
		routekey_hmac.update(Math.random().toString());
		var routekey = routekey_hmac.digest('hex');
		//package the data
		var temp_password_data = {
			temp_password: temp_password,
			temp_hash: hashed_data.hash,
			temp_salt: hashed_data.salt,
			routekey: routekey
		}
		if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, temp_password_data)};
	})
}

function sendEmail(username, temp_password, routekey, email, cb){
		var transporter = nodemailer.createTransport({
		  service: 'gmail',
		  auth: {
		    user: 'SOME EMAIL GOES HERE@gmail.com',
    		pass: 'SOME PASSWORD GOES HERE'
		  }
		});

		var mailOptions = {
		  from: 'SOME EMAIL GOES HERE@gmail.com',
		  to: email,
		  subject: 'Recover your forgotten PASSWORD',
		  text: 'You requested to recover your password for the username: '+username+'.  We have generated a temporary password that you may use to login by copying and pasting: '+temp_password+' ---  Once you are logged in, you may change your password.  To activate the temporary password, click on the following link: someroute/'+routekey+". This temporary password/link will expire in 30 mins."
		};
		//callback version
		transporter.sendMail(mailOptions, function(error, response){
			if (error){
				console.log('error sending email with username to: '+email)
				console.log(error)
			}
			else{
				console.log('recover-password---- email with username '+username+' sent to: ' + email)
				var valid = response.response.includes('OK');
				if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, valid)};
			}
		})
}


var testConfig = function(desiredDatabaseTestModule){//only call this if u are trying to test without the database
	databaseService.testConfig(desiredDatabaseTestModule);
}


module.exports = {
	testConfig: testConfig,
	sendResetLink: sendResetLink,
	generateTempPasswordData: generateTempPasswordData,
	sendEmail: sendEmail
}

})();//end IIFE