(function(){
var thunkify = require('../src/thunkConverter').thunkify;
var synchronize = require('../src/synchronize');
var login = require('../src/loginService')
var inputFilter = require('../src/userInputFilter');
var sessionGenerator = require('../src/sessionGenerator')
//thunked login methods
var checkRequest = thunkify(login.checkRequest);
var checkSession = thunkify(login.checkSession);
var generate_sessionID = thunkify(sessionGenerator.generate_key);
var delete_existing_sessionID = thunkify(sessionGenerator.deleteExistingSessionID)


var express = require('express');
var router = express.Router();


//attempt a username password login.
//if susccessful, generate a sessionID and set it as a cookie
//if un successful, just say login failed
router.post('/', function(req,res,next){//log in thru username/pass
	synchronize.run(function*(){
		//first line of defense, check for illegal chars in username or password
		if (!(inputFilter.checkUsername(req.fields.username) && inputFilter.checkPassword(req.fields.password))){
			res.send('invalid username or password inputted.  either size requirement is not met, or illegal characters are present');
		}
		//now go through regular login logic
		else{
			var valid = yield checkRequest(req);
			if (valid){
				yield delete_existing_sessionID(req);//delete any sessionIDs associated with user if they exist
				var sessionID = yield generate_sessionID(req);
				res.setHeader('Set-Cookie', ['sessionID='+sessionID]);
				res.send('login complete: your session ID is '+ sessionID);
			}
			else{
				res.send('login failed. make sure username and password match')
			}
		}
		
	})//end synchronize.run
})//end router.post '/'

//login via sessionID in cookie
// 1.check if sessionID is indatabase
// 2.if not, send login unsuccessful
router.post('/session', function(req,res,next){
	synchronize.run(function*(){
		var valid = yield checkSession(req);
		if (valid){res.send ('login successful! based on cookie')}
		else{res.send('login failed')};
	})
})

module.exports = router;



})();//end IIFE
