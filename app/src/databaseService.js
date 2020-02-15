(function(){
'use strict';
var postgreConnect = require('./postgrePoolConnector');
var thunkConverter = require('./thunkConverter');
var synchronize = require('./synchronize');

var executeQuery = thunkConverter.thunkify(postgreConnect.executeQuery);
var version = '';//controls which tables are used for the queries.  in the tests, test_ will be appended to table names

function getUsernameHashSalt(username, cb){
	synchronize.run(function*(){
		var queryString = "select * from user_credentials"+version+" where (username = E'"+username+"');";
		var db_data = yield executeQuery(queryString);
		var data = {
			username: (db_data !== undefined && db_data.rows[0] !== undefined) ? db_data.rows[0].username : undefined,
			email: (db_data !== undefined && db_data.rows[0] !== undefined) ? db_data.rows[0].email : undefined,
			hash: (db_data !== undefined && db_data.rows[0] !== undefined) ? db_data.rows[0].hash : undefined,
			salt: (db_data !== undefined && db_data.rows[0] !== undefined) ? db_data.rows[0].salt : undefined
		}
		if ((cb!=undefined)&&(typeof(cb)==='function')){cb(null, data)};
	})
}

function getUserCredsByEmail(email, cb){
	synchronize.run(function*(){
		var queryString = "select * from user_credentials"+version+" where (email = E'"+email+"');";
		var db_data = yield executeQuery(queryString);
		var data = {
			username: (db_data !== undefined && db_data.rows[0] !== undefined) ? db_data.rows[0].username : undefined,
			email: (db_data !== undefined && db_data.rows[0] !== undefined) ? db_data.rows[0].email : undefined,
			hash: (db_data !== undefined && db_data.rows[0] !== undefined) ? db_data.rows[0].hash : undefined,
			salt: (db_data !== undefined && db_data.rows[0] !== undefined) ? db_data.rows[0].salt : undefined
		}
		if ((cb!=undefined)&&(typeof(cb)==='function')){cb(null, data)};
	})
}

function insertUsernameEmailHashSalt(username, email, hash, salt, cb){
	synchronize.run(function*(){
		var queryString = "insert into user_credentials"+version+" values (E'"+username+"', E'"+email+"', E'"+hash+"', E'"+salt+"');";
		yield executeQuery(queryString);
		if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, null)};
	})
	
}

function updatePassword(username, newHash, newSalt, cb){
	synchronize.run(function*(){
		var queryString = "update user_credentials"+version+" set hash = E'"+newHash+"' where username = E'"+username+"';";
		yield executeQuery(queryString);
		queryString = "update user_credentials"+version+" set salt = E'"+newSalt+"' where username = E'"+username+"';";
		yield executeQuery(queryString);
		if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, null)};
	})
}

function updateEmail(username, newEmail, cb){
	synchronize.run(function*(){
		var queryString = "update user_credentials"+version+" set email = E'"+newEmail+"' where username = E'"+username+"';";
		yield executeQuery(queryString);
		if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, null)};
	})
}

function deleteAllUserCredentialsTest(cb){
	synchronize.run(function*(){
		var queryString = "delete from user_credentials_test;";//this query is only allowed on the test table of user-credentials
		yield executeQuery(queryString);
		if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, null)};
	})
}

function getSessionUsernameIP(sessionID, cb){
	synchronize.run(function*(){
			var queryString = "select * from sessions"+version+" where sessionid = E'"+sessionID+"';";
			//console.log(queryString);
			var sessionData = yield executeQuery(queryString);
			var data = {
				username: (sessionData !== undefined && sessionData.rows[0] !== undefined) ? sessionData.rows[0].username : undefined,
				sessionID: (sessionData !== undefined && sessionData.rows[0] !== undefined) ? sessionData.rows[0].sessionid : undefined,
				ip: (sessionData !== undefined && sessionData.rows[0] !== undefined) ? sessionData.rows[0].ip : undefined
			}
			if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, data)};
		})	
}

function getSessionDataByUsername(username, cb){
	synchronize.run(function*(){
			var queryString = "select * from sessions"+version+" where username = E'"+username+"';";
			//console.log(queryString);
			var sessionData = yield executeQuery(queryString);
			var data = {
				username: (sessionData !== undefined && sessionData.rows[0] !== undefined) ? sessionData.rows[0].username : undefined,
				sessionID: (sessionData !== undefined && sessionData.rows[0] !== undefined) ? sessionData.rows[0].sessionid : undefined,
				ip: (sessionData !== undefined && sessionData.rows[0] !== undefined) ? sessionData.rows[0].ip : undefined
			}
			if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, data)};
		})	
}

function insertSessionUsernameIP(key, username, ip, cb){
	synchronize.run(function*(){
		var queryString = "insert into sessions"+version+" values (E'"+key+"', E'"+username+"', E'"+ip+"');";
		//console.log(queryString);
		yield executeQuery(queryString);
		if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, null)};
	})
}





function deleteSessionData(key, cb){
	synchronize.run(function*(){
		var queryString = "delete from sessions"+version+" where (sessionid = E'"+key+"');"
		//console.log(queryString);
		yield executeQuery(queryString);
		if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, null)};
	})
}

function deleteAllSessionData(cb){//only to be used on sessions_test database
	synchronize.run(function*(){
		var queryString = "delete from sessions_test;"
		//console.log(queryString);
		yield executeQuery(queryString);
		if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, null)};
	})
}

function deleteSessionIDBasedOnUser (username, cb){
	synchronize.run(function*(){
		var queryString = "delete from sessions"+version+" where (username = E'"+username+"');";
		yield executeQuery(queryString);
		if((cb!=undefined)&&(typeof(cb)==='function')){cb(null, null)};
	})
}


//************** temporary_user_passwords table operations
function getTempPasswordInfoByUsername (username, cb){
	synchronize.run(function*(){
		var queryString = "select * from temporary_user_passwords"+version+" where (username = E'"+username+"');";
		var result = yield executeQuery(queryString);
		var data = {
				username: (result !== undefined && result.rows[0] !== undefined) ? result.rows[0].username : undefined,
				temp_password: (result !== undefined && result.rows[0] !== undefined) ? result.rows[0].temp_password : undefined,
				temp_hash: (result !== undefined && result.rows[0] !== undefined) ? result.rows[0].temp_hash : undefined,
				temp_salt: (result !== undefined && result.rows[0] !== undefined) ? result.rows[0].temp_salt : undefined,
				routekey: (result !== undefined && result.rows[0] !== undefined) ? result.rows[0].routekey : undefined	
			}
		if ((cb!=undefined)&&(typeof(cb)==='function')){cb(null, data)}
	})
}

function getTempPasswordInfoByRoutekey (routekey, cb){
	synchronize.run(function*(){
		var queryString = "select * from temporary_user_passwords"+version+" where (routekey = E'"+routekey+"');";
		var result = yield executeQuery(queryString);
		var data = {
				username: (result !== undefined && result.rows[0] !== undefined) ? result.rows[0].username : undefined,
				temp_password: (result !== undefined && result.rows[0] !== undefined) ? result.rows[0].temp_password : undefined,
				temp_hash: (result !== undefined && result.rows[0] !== undefined) ? result.rows[0].temp_hash : undefined,
				temp_salt: (result !== undefined && result.rows[0] !== undefined) ? result.rows[0].temp_salt : undefined,
				routekey: (result !== undefined && result.rows[0] !== undefined) ? result.rows[0].routekey : undefined	
			}
		if ((cb!=undefined)&&(typeof(cb)==='function')){cb(null, data)}
	})
}

function insertTempPasswordInfo (username, temp_password, temp_hash, temp_salt, routekey, cb){
	synchronize.run(function*(){
		var queryString = "insert into temporary_user_passwords"+version+" values (E'"+username+"', E'"+temp_password+"', E'"+temp_hash+"', E'"+temp_salt+"', E'"+routekey+"');";
		yield executeQuery(queryString);
		if ((cb!=undefined)&&(typeof(cb)==='function')){cb(null, null)}
	})
}

function deleteTempPasswordInfoByUsername (username, cb){
	synchronize.run(function*(){
		var queryString = "delete from temporary_user_passwords"+version+" where (username = E'"+username+"');";
		yield executeQuery(queryString);
		if ((cb!=undefined)&&(typeof(cb)==='function')){cb(null, null)}
	})
}

function deleteTempPasswordInfoByRoutekey (routekey, cb){
	synchronize.run(function*(){
		var queryString = "delete from temporary_user_passwords"+version+" where (routekey = E'"+routekey+"');";
		yield executeQuery(queryString);
		if ((cb!=undefined)&&(typeof(cb)==='function')){cb(null, null)}
	})
}

function deleteAllTempPasswordData (cb){//use only for testing (so on _test table)
	synchronize.run(function*(){
		var queryString = "delete from temporary_user_passwords_test";
		yield executeQuery(queryString);
		if ((cb!=undefined)&&(typeof(cb)==='function')){cb(null, null)}
	})
}


function testConfig(testDatabaseModule){
	//use this for offline testing, aka rendering fake database modules
	executeQuery = thunkConverter.thunkify(testDatabaseModule.executeQuery);
}

var herokuTestConfig = {
	enableTest : function(){version = '_test'},//appends _test before table names
	disableTest : function(){version = ''},
	getVersion : function(){return version}
}

module.exports = {
	getSessionUsernameIP: getSessionUsernameIP,
	insertSessionUsernameIP: insertSessionUsernameIP,
	deleteSessionData: deleteSessionData,
	testConfig: testConfig,
	insertUsernameEmailHashSalt:insertUsernameEmailHashSalt,
	getUsernameHashSalt: getUsernameHashSalt,
	herokuTestConfig: herokuTestConfig,
	deleteAllUserCredentialsTest: deleteAllUserCredentialsTest,
	deleteAllSessionData: deleteAllSessionData,
	getUserCredsByEmail: getUserCredsByEmail,
	version: version,
	deleteSessionIDBasedOnUser: deleteSessionIDBasedOnUser,
	getSessionDataByUsername: getSessionDataByUsername,
	updatePassword: updatePassword,
	updateEmail: updateEmail,
	getTempPasswordInfoByRoutekey: getTempPasswordInfoByRoutekey,
	getTempPasswordInfoByUsername: getTempPasswordInfoByUsername,
	deleteTempPasswordInfoByRoutekey: deleteTempPasswordInfoByRoutekey,
	deleteTempPasswordInfoByUsername: deleteTempPasswordInfoByUsername,
	deleteAllTempPasswordData: deleteAllTempPasswordData,
	insertTempPasswordInfo: insertTempPasswordInfo
}

})();//end IIFe