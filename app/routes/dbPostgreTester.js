
//want to use this route to test on heroku specifically the database Service module.
//different API endpoints will test the different databaseService functions.
//as abaseline, we need data retrieval to check if inserts/updates worked correctly
//we also need a reset that wipes the database clean.
//NOTE - I am going to set up some test tables in the database.  a databaseService.config will change the targets of the query strings to do this.  
//however, u must reset the config after every test incase this is done when the app is live.  
//EITHER WAY, you should never run this test on the same server that an app is live. it could lead to shitloads of complications. if needed, make a copy and test on a separate server
var thunkify = require('../src/thunkConverter').thunkify;
var synchronize = require('../src/synchronize');
var databaseService = require('../src/databaseService');
var herokuTestConfig = databaseService.herokuTestConfig;

var express = require('express');
var login = require('../src/loginService')
var router = express.Router();

router.get('/', function(req, res, next){
	res.sendFile(__dirname + '/templates/databaseServiceTestEndpoints.html')
})

router.get('/getUserCreds/:username', function(req,res,next){
	var getUsernameHashSalt = thunkify(databaseService.getUsernameHashSalt);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		var db_data = yield getUsernameHashSalt(req.params.username);
		console.log('DB DATA from usercreds!!!!!!!!!!!!!!!---',db_data);
		herokuTestConfig.disableTest();
		res.send(db_data);
	})
})

router.get('/getUserCredsByEmail/:email', function(req,res,next){
	var getUserCredsByEmail = thunkify(databaseService.getUserCredsByEmail);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		var db_data = yield getUserCredsByEmail(req.params.email);
		herokuTestConfig.disableTest();
		res.send(db_data);
	})
})

router.get('/insertUserCreds/:username/:email/:hash/:salt', function(req,res,next){
	var insertUsernameEmailHashSalt = thunkify(databaseService.insertUsernameEmailHashSalt);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		yield insertUsernameEmailHashSalt(req.params.username, req.params.email, req.params.hash, req.params.salt);
		herokuTestConfig.disableTest();
		res.send('done');
	})
})

router.get('/updatePassword/:username/:newHash/:newSalt', function(req, res, next){
	var updatePassword = thunkify(databaseService.updatePassword);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		yield updatePassword(req.params.username, req.params.newHash, req.params.newSalt);
		herokuTestConfig.disableTest();
		res.send('done');
	})
})

router.get('/updateEmail/:username/:newEmail', function(req, res, next){
	var updateEmail = thunkify(databaseService.updateEmail);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		yield updateEmail(req.params.username, req.params.newEmail);
		herokuTestConfig.disableTest();
		res.send('done');
	})
})

router.get('/deleteAllUserCreds', function(req,res,next){
	var deleteAllUserCreds = thunkify(databaseService.deleteAllUserCredentialsTest);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		yield deleteAllUserCreds();
		herokuTestConfig.disableTest();
		res.send('done');
	})
})


router.get('/getSessionUsernameIP/:sessionID', function(req,res,next){
	var getSessionUsernameIP = thunkify(databaseService.getSessionUsernameIP);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		var data = yield getSessionUsernameIP(req.params.sessionID);
		herokuTestConfig.disableTest();
		res.send(data);
	})
})

router.get('/getSessionDataByUsername/:username', function(req,res,next){
	var getSessionDataByUsername = thunkify(databaseService.getSessionDataByUsername);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		var data = yield getSessionDataByUsername(req.params.username);
		console.log('DATA----------------', data)
		herokuTestConfig.disableTest();
		res.send(data);
	})
})


router.get('/insertSessionUsernameIP/:sessionID/:username/:ip', function(req,res,next){
	var insertSessionUsernameIP = thunkify(databaseService.insertSessionUsernameIP);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		yield insertSessionUsernameIP(req.params.sessionID, req.params.username, req.params.ip);
		herokuTestConfig.disableTest();
		res.send('done');
	})
})

router.get('/deleteSessionIDBasedOnUser/:username', function(req, res, next){
	var deleteSessionIDBasedOnUser = thunkify(databaseService.deleteSessionIDBasedOnUser);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		yield deleteSessionIDBasedOnUser(req.params.username);
		herokuTestConfig.disableTest();
		res.send('done');
	})
})


router.get('/deleteAllSessionData', function(req, res, next){
	var deleteAllSessionData = thunkify(databaseService.deleteAllSessionData);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		yield deleteAllSessionData();
		herokuTestConfig.disableTest();
		res.send('done');
	})
})


router.get('/deleteSessionData/:sessionID', function(req,res,next){
	var deleteSessionData = thunkify(databaseService.deleteSessionData);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		yield deleteSessionData(req.params.sessionID);
		herokuTestConfig.disableTest();
		res.send('done');
	})
})

//******* temporary_user_passwords table operations
router.get('/getTempPasswordInfoByUsername/:username', function(req,res,next){
	var getTempPasswordInfoByUsername = thunkify(databaseService.getTempPasswordInfoByUsername);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		var data = yield getTempPasswordInfoByUsername(req.params.username);
		herokuTestConfig.disableTest();
		console.log('temp password data requested!!!!!!!!!!!!!!------------------------- ',data)
		res.send(data);
	})
})

router.get('/getTempPasswordInfoByRoutekey/:routekey', function(req,res,next){
	var getTempPasswordInfoByRoutekey = thunkify(databaseService.getTempPasswordInfoByRoutekey);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		var data = yield getTempPasswordInfoByRoutekey(req.params.routekey);
		herokuTestConfig.disableTest();
		res.send(data);
	})
})

router.get('/insertTempPasswordInfo/:username/:temp_password/:temp_hash/:temp_salt/:routekey', function(req,res,next){
	var insertTempPasswordInfo = thunkify(databaseService.insertTempPasswordInfo);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		yield insertTempPasswordInfo(req.params.username, req.params.temp_password, req.params.temp_hash, req.params.temp_salt, req.params.routekey);
		herokuTestConfig.disableTest();
		res.send('done');
	})
})

router.get('/deleteTempPasswordInfoByUsername/:username', function(req,res,next){
	var deleteTempPasswordInfoByUsername = thunkify(databaseService.deleteTempPasswordInfoByUsername);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		yield deleteTempPasswordInfoByUsername(req.params.username);
		herokuTestConfig.disableTest();
		res.send('done');
	})
})

router.get('/deleteTempPasswordInfoByRoutekey/:routekey', function(req,res,next){
	var deleteTempPasswordInfoByRoutekey = thunkify(databaseService.deleteTempPasswordInfoByRoutekey);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		yield deleteTempPasswordInfoByRoutekey(req.params.routekey);
		herokuTestConfig.disableTest();
		res.send('done');
	})
})

router.get('/deleteAllTempPasswordData', function(req,res,next){
	var deleteAllTempPasswordData = thunkify(databaseService.deleteAllTempPasswordData);
	synchronize.run(function*(){
		herokuTestConfig.enableTest();
		yield deleteAllTempPasswordData();
		herokuTestConfig.disableTest();
		res.send('done');
	})
})


module.exports = router;

