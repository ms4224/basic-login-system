(function(){
'use strict';
var synchronize = require('./synchronize');
var databaseService = require('./databaseService');
var thunkify = require('./thunkConverter').thunkify;
var nodemailer = require('nodemailer');

//thunked functions
var getUserCredsByEmail = thunkify(databaseService.getUserCredsByEmail);
var sendCreds = thunkify(sendEmail);


//check if email exists
//if it does, send username to email, and yield a valid
//incase it failed, yield an invalid (false) to caller

function emailUsername (email, cb){
	synchronize.run(function*(){
		var dbData = yield getUserCredsByEmail(email);
		if (dbData.email == undefined){//if email does not exist
			if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, false)};
		}
		else{
			//send username to email
			var success = yield sendCreds(dbData.email, dbData.username);
			if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, success)};
		}
	})
}

function sendEmail(email, username, cb){
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
		  subject: 'Recover your forgotten username',
		  text: 'The following is your username that you requested to be emailed to you: '+username
		};
		//callback version
		transporter.sendMail(mailOptions, function(error, response){
			if (error){
				console.log('error sending email with username to: '+email)
				console.log(error)
			}
			else{
				console.log('email with username sent to: ' + email)
				var valid = response.response.includes('OK');
				if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, valid)};
			}
		})
}

var testConfig = function(desiredDatabaseTestModule){//only call this if u are trying to test without the database
	databaseService.testConfig(desiredDatabaseTestModule);
}

module.exports = {
	emailUsername: emailUsername,
	testConfig: testConfig
}


})();//end IIFE