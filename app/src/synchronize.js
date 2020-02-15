(function(){
//this module is to run a generator function (that uses thunks) to make code look synchronous

function run(genFn){
	var generator = genFn();//generator is in suspended state
	next();

	function next(err, res){//this will serve as the callback for async functions, which creates the pausing of the generator
		if (err) {console.log(err)};
		var continuable = generator.next(res);//passes the result of the async call back to the generator's yield, and moves on to the next asyncFunc
		if (continuable.done){return};//return if the generator is finished with all yields
		var nextAsyncFunc = continuable.value;
		nextAsyncFunc(next);//call the next async function, with next as the callback(going into the thunk); this will resume the generator thru the callback
	}
}

function runHTTPRequest(genFn){//variant for the request module which has more arguments to its callback
	var generator = genFn();//generator is in suspended state
	next();

	function next(err, res, body){//this will serve as the callback for async functions, which creates the pausing of the generator
		if (err) {console.log(err)};
		var responseData = {response: res, body: body, error: err};
		var continuable = generator.next(responseData);//passes the result of the async call back to the generator's yield, and moves on to the next asyncFunc
		if (continuable.done){return};//return if the generator is finished with all yields
		var nextAsyncFunc = continuable.value;
		nextAsyncFunc(next);//call the next async function, with next as the callback(going into the thunk); this will resume the generator thru the callback
	}
}

module.exports = {
	run: run,
	runHTTPRequest: runHTTPRequest
}

})();//end IIFE