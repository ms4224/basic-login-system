(function(){
var express = require('express');
var router = express.Router();

var thunkify = require('../src/thunkConverter').thunkify;
var synchronize = require('../src/synchronize');
var login = require('../src/loginService')
var inputFilter = require('../src/userInputFilter');
var updateService = require('../src/updateService');
var signupService = require('../src/signupService');
//thunked methods
var checkRequest = thunkify(login.checkRequest);
var updatePassword = thunkify(updateService.updatePassword);
var updateEmail = thunkify(updateService.updateEmail);
var checkEmailAvailability = thunkify(signupService.checkEmail);

router.post('/password', function(req,res,next){//log in thru username/pass
	synchronize.run(function*(){
		//first line of defense, check for illegal chars in username, password, and new password
		if (!(inputFilter.checkUsername(req.fields.username) && inputFilter.checkPassword(req.fields.password) && inputFilter.checkPassword(req.fields.newPassword))){
			res.send('invalid username or password inputted.  either size requirement is not met, or illegal characters are present');
		}
		//now go through regular login logic and update the password
		else{
			var valid = yield checkRequest(req);
			if (valid){
				var update_successful = yield updatePassword(req);//delete any sessionIDs associated with user if they exist
				if (update_successful){
					res.send('password updated successfully');
				}
				else{
					res.send('password update failed internally. please try again')
				}
			}
			else{
				res.send('login failed. make sure username and password match')
			}
		}
		
	})//end synchronize.run
})//end router.post '/'

//this one also needs to check if the desired email already exists in the database
router.post('/email', function(req,res,next){//log in thru username/pass
	synchronize.run(function*(){
		//first line of defense, check for illegal chars in username, password, and new desired email
		if (!(inputFilter.checkUsername(req.fields.username) && inputFilter.checkPassword(req.fields.password) &&inputFilter.checkEmail(req.fields.newEmail))){
			res.send('invalid username, password, or email inputted.  either size requirement is not met, or illegal characters are present');
		}
		//now go through regular login logic and update the password
		else{
			var valid = yield checkRequest(req);
			if (valid){
				req.fields.email = req.fields.newEmail;//this is because the checkEmailAvailability assumes there is a req.fields.email
				if(!(yield checkEmailAvailability(req))){
					res.send('email is already registered to a user. choose a different email')
				}
				else{
					var update_successful = yield updateEmail(req);//delete any sessionIDs associated with user if they exist
					if (update_successful){
						res.send('Email updated successfully');
					}
					else{
						res.send('Email update failed internally. please try again')
					}	
				}
			}
			else{
				res.send('login failed. make sure username and password match')
			}
		}
		
	})//end synchronize.run
})//end router.post '/'


module.exports = router;

})();//end IIFE