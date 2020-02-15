(function(){
'use strict'

//this is phase 2 of forgot password (phase 1 being creating temp credentials and sending a reset activation link)
// resetPasswordroute/service
// 1.user-clicked-link contains routekey parameter - this will happen in the route, the rest happens in this service
// 2.check if routekey exists in temporary_user_password table
// 3.if it does, update the user's hash and salt in user_credentials to match the temporary_user_password table
// 4.delete the entry for the routekey in temporary_user_password table
// 5.return a valid
// 6.if the routekey did not exist, return a false or message (link expired)

var thunkify = require('./thunkConverter').thunkify;
var synchronize = require('./synchronize');
var databaseService = require('./databaseService');

//thunked methods
var getTempPasswordInfoByRoutekey = thunkify(databaseService.getTempPasswordInfoByRoutekey)
var updatePassword = thunkify(databaseService.updatePassword);
var deleteTempPasswordInfoByRoutekey = thunkify(databaseService.deleteTempPasswordInfoByRoutekey)

function resetPassword(routekey, cb){
	synchronize.run(function*(){
		var valid;
		var temp_password_data = yield getTempPasswordInfoByRoutekey(routekey);
		//check if temp_password credentials exist for specified routekey
		//cas a, not exist, return a false
		if (temp_password_data.temp_password === undefined || temp_password_data.temp_hash === undefined || temp_password_data.temp_salt === undefined || temp_password_data.username === undefined || temp_password_data.routekey === undefined){
			valid = false;
			if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, valid)};//routekey did not exist, so return a false
		}
		//case b, exists, update user hash, salt; delete temporary password info; return true;
		else{
			yield updatePassword(temp_password_data.username, temp_password_data.temp_hash, temp_password_data.temp_salt);
			yield deleteTempPasswordInfoByRoutekey(routekey);
			valid = true;
			if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, valid)};
		}
	})
}

var testConfig = function(desiredDatabaseTestModule){//only call this if u are trying to test without the database
	databaseService.testConfig(desiredDatabaseTestModule);
}

module.exports = {
	resetPassword: resetPassword,
	testConfig: testConfig
}


})();//end IIFe