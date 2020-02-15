(function(){
'use strict'

var express = require('express');
var router = express.Router();




router.get('/sample', function(req,res,next){
	//res.send('form');
	res.sendFile(__dirname + '/templates/sampleForm.html');
})

router.get('/heroku-sample', function(req,res,next){
	//res.send('form');
	res.sendFile(__dirname + '/templates/onlineSampleForm.html');
})

router.get('/sample-cookie', function(req,res,next){
	res.sendFile(__dirname + '/templates/sampleForm2.html');
})

router.get('/heroku-sample-cookie', function(req,res,next){
	//res.send('form');
	res.sendFile(__dirname + '/templates/onlineCookieForm.html');
})

router.get('/signup-sample', function(req, res, next){
	res.sendFile(__dirname + '/templates/signupSampleForm.html');
})

router.get('/signup-sample-heroku', function(req, res, next){
	res.sendFile(__dirname + '/templates/signupSampleFormHeroku.html');
})

module.exports = router;




})();//end IIFE

