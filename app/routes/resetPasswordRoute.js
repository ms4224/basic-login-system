(function(){
'use strict'

var express = require('express');
var router = express.Router();

var thunkify = require('../src/thunkConverter').thunkify;
var synchronize = require('../src/synchronize');
var resetPasswordService = require('../src/resetPasswordService');
var inputFilter = require('../src/userInputFilter');

//thunked methods
var resetPassword = thunkify(resetPasswordService.resetPassword)

router.post('/:routekey', function(req, res, next){
	synchronize.run(function*(){
		if (!(inputFilter.checkRoutekey(req.params.routekey))){
			res.send('illegal routekey inputted. if you are hacker, you got owned. If you are a user, please try resetting your password from the forgot user password section on the dashboard')
		}
		else{
			var success = yield resetPassword(req.params.routekey);
			if (success){
				res.send('Password has been reset for your account to the ultra secret password we sent you in the reset email.  Use that password to log in, and from there, you can change your password via the user dashboard.')
			}
			else{
				res.send('Error.  The link you used to reset your password may have expired by now.  Try resetting your password again by going to the forgot password section of the dashboard, and follow the instructions')
			}
		}
	})
})

module.exports = router;

})();//end IIFE