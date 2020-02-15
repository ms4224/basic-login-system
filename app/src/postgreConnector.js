(function(){

const { Client } = require('pg');

//takes in a query string and a callback Fn
function executeQuery(queryString, callBackFn){
	//create new client
	var client = new Client({
	  connectionString: process.env.DATABASE_URL,
	  ssl: true
	});

	client.connect();
	client.query(queryString, callBackFn);//execute the query and pass in callback function (this will be the next from yield)
}//end query


//export the module
module.exports = {
	executeQuery: executeQuery
}



})();//end iife



