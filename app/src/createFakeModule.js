(function(){
//this module is to aid in testing, returns a "fake" postgreconnector module that has an execute query function

function generate(desiredReturnObject, error){
	var fakeModule = {
		executeQuery : function(queryString, cb){
			setTimeout(function(){
				cb(error, desiredReturnObject)
			}, 20)
		}
	}

	return fakeModule;
}

module.exports = {
	generate: generate
}



})();//end IIFE