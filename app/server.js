//eventEmitter leak bug fix
require('events').EventEmitter.defaultMaxListeners = 0;

var express=require('express');
var app=express();
var port = process.env.PORT || 8080;


var testRoute = require('./routes/testRoute');
var sampleFormRoute = require('./routes/sampleForm')
var loginRoute = require('./routes/loginRoute');
var databaseServiceTestRoute = require('./routes/dbPostgreTester');
var signupRoute = require('./routes/signupRoute');
var configureTestDatabaseRoute = require('./routes/configureTestDatabaseRoute');
var updateCredentialsRoute = require('./routes/updateCredentialsRoute');
var forgotCredentialsRoute = require('./routes/forgotCredentialsRoute');
var resetPasswordRoute = require('./routes/resetPasswordRoute');

var formidable = require('express-formidable');
var formidable_options = {
	encoding: 'binary',
	uploadDir: './tmp',
	multiples: true
}

app.use(formidable(formidable_options));


app.use('/forms', sampleFormRoute);
app.use('/login', loginRoute);
app.use('/', testRoute);
app.use('/databaseServiceTest', databaseServiceTestRoute);
app.use('/signup', signupRoute);
app.use('/databaseTestingConfig', configureTestDatabaseRoute);
app.use('/updateCredentials', updateCredentialsRoute);
app.use('/forgot_credentials', forgotCredentialsRoute);
app.use('/resetPassword', resetPasswordRoute);


app.get('/', function(req, res){
	res.send('you are in home page.  try /databaseServiceTest, /forms, /login, or /checkIP');
})

app.listen(port, function(){
	console.log('listening on port 8080 or on heroku');
})