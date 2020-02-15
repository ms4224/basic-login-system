(function(){

var databaseService = require('../src/databaseService')
var herokuTestConfig = databaseService.herokuTestConfig;


var express = require('express');
var router = express.Router();

router.get('/enable', function(req, res, next){
	herokuTestConfig.enableTest();
	console.log("DATABASETEST TABLES JUST ENABLED--------, version = ", herokuTestConfig.getVersion());
	// res.send('switched over to _test database tables');
	res.send('switched over to test database tables. databaseService.version = '+herokuTestConfig.getVersion());
})

router.get('/disable', function(req, res, next){
	herokuTestConfig.disableTest();
	console.log("DATABASETEST TABLES JUST DISABLED--------, version = ", databaseService.version)
	res.send('switched over to regular database tables. databaseService.version = '+herokuTestConfig.getVersion());
})

module.exports = router;

})();//end IIFE