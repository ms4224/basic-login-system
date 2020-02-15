(function(){
'use strict'

//this module takes an async function and converts it into a thunk style to be used with generators to make code look synchronous

function thunkify(someAsyncFunc){
	var myAsyncFunc = someAsyncFunc;
	return function(){
		var args = Array.prototype.slice.call(arguments);
		return function(cbFn) {
			args.push(cbFn);
			myAsyncFunc.apply(this, args);
		}
	}
}

module.exports = {
	thunkify: thunkify
}





})();//end IIFE