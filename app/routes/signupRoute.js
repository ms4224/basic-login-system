(function(){
//this is the route the server will use when a new user is registering his info (username, password, email)

var thunkify = require('../src/thunkConverter').thunkify;
var synchronize = require('../src/synchronize');
var signupService = require('../src/signupService');
var inputFilter = require('../src/userInputFilter');
//thunked signup methods
var checkUsernameAvailability = thunkify(signupService.checkUsername);
var checkEmailAvailability = thunkify(signupService.checkEmail);
var signup = thunkify(signupService.signup);

var express = require('express');
var router = express.Router();


// 1.check username, password, and email to make sure they satisfy requirements (size length, no illegal chars)
// 2.check availability username
// 3. check availability of email
// 4. store username, password, email 
// 5. return success message if this succeeded


router.post('/', function(req, res, next){
	synchronize.run(function*(){
		if (!(inputFilter.checkUsername(req.fields.username) && inputFilter.checkPassword(req.fields.password) && inputFilter.checkEmail(req.fields.email))){
			res.send('invalid username, password, or email.  either size requirement is not met, or illegal characters are present');
		}
		else if(!(yield checkUsernameAvailability(req))){
			res.send('username is already taken. please choose a different username');
		}
		else if(!(yield checkEmailAvailability(req))){
			res.send('email is already registered. Cannot use this email')
		}
		else {
			var success = yield signup(req);
			var final_message = (success) ? 'Signup completed successfully.  You will now be able to log in. Still need to implement email confirm.' : 'error signing up. database entry failed.';
			res.send(final_message);
		}
	})
})

module.exports = router;



})();//end IIFE