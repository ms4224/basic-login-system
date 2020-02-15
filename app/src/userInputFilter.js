// this module is the first line of defense for user inputs (username/password).  it will check for illegal chars, just incase they somehow got past the front end.
// it will have two functions, one to check username, one to check password

// username only allows a-z, A-z, 0-9, -
// password allows ascii 32-122 (32 is a space, keep this in mind). DOES NOT ALLO ASCII 92, which is the \
// password length is at least 6 chars and maximum 100 chars

(function(){
'use strict';

function checkUsername(string){
	if (typeof(string)!=='string'){return false};
	if (string.length < 4 || string.length >15){return false};//size limits at least 4 chars, equal to or less than 15 chars
	var cleanString = string.replace(' ','').replace('_','').replace('"','').replace("'","");
	cleanString = cleanString.replace(/\\/, '');
	cleanString = cleanString.replace('%', '');
	if(string !== cleanString){return false};
	return checkValidCharCodesUsername(string);
}

function checkPassword(password){
	if(typeof(password) !== 'string'){return false};
	if (password.length < 6 || password.length >100){return false};//check min and max size requirements
	var clean = password.replace(/\\/, '');//check for \r, etc
	if (password !== clean){return false};
	if (password === '' || password === null || password === undefined){return false};//check for empty passwords
	for (var i=0; i<password.length; i++){//verify char is in 32-122
		var curCode = password.charCodeAt(i);
		if (curCode<32 || curCode>122){
			return false;
		}
	}
	return true;
}


function checkValidCharCodesUsername(string){//allows a-z, A-Z, 0-9, -,  
	var clean = string;
	var curCode;
	for (var i=0; i<string.length; i++){//allow azz, A-Z, 0-9,-
		curCode = string.charCodeAt(i);
		if (!(((curCode >= 65) && (curCode <= 90)) || ((curCode >= 97) && (curCode <= 122)) || ((curCode >= 48) && (curCode <= 57)) || (curCode === 45/*allow -*/)))  {
			return false;
		}
	}

	return true;
}

function checkEmail(email){
	if(typeof(email) !== 'string'){return false};
	if (email.length < 3 || email.length >150){return false};//size limits at least 3 chars, equal to or less than 150 chars
	//check for just one @
	if(!(email.includes('@'))){return false};
	var clean = email.replace('@', '');
	if (clean.includes('@')){return false};
	//only allow a-z, A-Z, 0-9, - _ .
	var curCode;
	for (var i=0; i<clean.length; i++){
		curCode = clean.charCodeAt(i);
		if (!(((curCode >= 65) && (curCode <= 90)) || ((curCode >= 97) && (curCode <= 122)) || ((curCode >= 48) && (curCode <= 57)) || (curCode === 45/*allow -*/) || (curCode === 46/*allow .*/) || (curCode === 95/*allow _*/))){
			return false;
		}
	}
	return true;
}

function checkRoutekey(routekey){//for now, same logic and restrictions as checkPassword
	if(typeof(routekey) !== 'string'){return false};
	if (routekey.length < 6 || routekey.length >100){return false};//check min and max size requirements
	var clean = routekey.replace(/\\/, '');//check for \r, etc
	if (routekey !== clean){return false};
	if (routekey === '' || routekey === null || routekey === undefined){return false};//check for empty routekeys
	for (var i=0; i<routekey.length; i++){//verify char is in 32-122
		var curCode = routekey.charCodeAt(i);
		if (curCode<32 || curCode>122){
			return false;
		}
	}
	return true;
}


module.exports = {
	checkUsername: checkUsername,
	checkPassword: checkPassword,
	checkEmail: checkEmail,
	checkRoutekey: checkRoutekey
}

})();//end IIFe