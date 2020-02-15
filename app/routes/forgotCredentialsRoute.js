(function(){
var express = require('express');
var router = express.Router();

var thunkify = require('../src/thunkConverter').thunkify;
var synchronize = require('../src/synchronize');
var inputFilter = require('../src/userInputFilter');
var forgotUsernameService = require('../src/forgotUsernameService')
var forgotPasswordService = require('../src/forgotPasswordService')

//thunked methods
var sendUsernameRecoveryEmail = thunkify(forgotUsernameService.emailUsername);
var sendPasswordResetEmail = thunkify(forgotPasswordService.sendResetLink);

//forgot username route
//0.validate input for illegal chars
//1. enter email address (receives email address through post form)
//2. forgotUsernameService.sendusername
router.post('/username', function(req, res, next){//forgot username route
	synchronize.run(function*(){
		//first line of defense, check for illegal chars in username, password, and new desired email
		if (!(inputFilter.checkEmail(req.fields.email))){
			res.send('invalid email inputted.  either size requirement is not met, or illegal characters are present');
		}
		else{
			var success = yield sendUsernameRecoveryEmail(req.fields.email);
			if (success){
				res.send('Email sent to registered email with username');
			}
			else{
				res.send('Error.  Make sure correct email was provided.  Otherwise, the email registered for the account is invalid, or there was a server error. Please try again.')
			}
		}
	})
})

router.post('/password', function(req, res, next){//forgot password route, input is a username
	synchronize.run(function*(){
		if (!(inputFilter.checkUsername(req.fields.username))){//preliminary username check for illegal chars
			res.send('invalid username inputted.  either size requirement is not met, or illegal characters are present');
		}
		else{
			var success = yield sendPasswordResetEmail(req.fields.username);
			if (success){
				res.send('Password reset instructions and link sent to email registered to username: '+req.fields.username);
			}
			else{
				res.send('Error. Either username does not exist in records or there was a system error.  Double check that inputted username is correct and try again.')
			}
		}
	})
	
})




module.exports = router;

})();//end IIFE