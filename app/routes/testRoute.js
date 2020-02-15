
var express = require('express');
var login = require('../src/loginService')
var router = express.Router();

// var formidable = require('express-formidable');
// var formidable_options = {
// 	encoding: 'binary',
// 	uploadDir: './tmp',
// 	multiples: true
// }

// router.use(formidable(formidable_options));



router.get('/checkIP', function(req,res,next){
	res.send(req.ip);
})



module.exports = router;


	// extractSessionIDfromCookie
	// getID and IP from database;
	// if (databaseID && req.ip==databaseIP) 
	// 	use databaseUserName and databasePass to do shit.
	// else
	// 	check userName/pass...(see below)

	// var valid = check userName/pass
	// if (valid){//u need to think of loopsholes here if ppl are loggin in at the same time...how do we generate a proper sessionID??
	// 	generateSessionID;
	// 	storeSessionID, req.ip, username, pass, in sessionID table!
	// }
	// res.setHeader('cookie', "sessionID="+sessionID.toString);
	// res.send('login successful'and/or data);