var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var jwt        = require("jsonwebtoken");
var morgan     = require("morgan");
var private_config = require('../private_config');
var mailer = require('express-mailer');
var RolesHelper	= require('../helpers/checkAuth');
var util = require('../helpers/util');

module.exports = function(app){

	var secret_sauce = 'this_is_my_secret_sauce';
	var sessionStore = new express.session.MemoryStore();
	var cookieParser = express.cookieParser(secret_sauce);

	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, '../public')));
	app.set('photos',path.join(__dirname,'../public/photos/'));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(morgan("dev"));
	app.use(function(req, res, next) {
	    res.setHeader('Access-Control-Allow-Origin', '*');
	    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	    next();
	});
	app.use(function (req, res, next) {
		// expose session to views
		if(typeof req.session.expose === 'undefined'){
			req.session.expose = {};
		}

		if(req.session.expose.message){
			delete req.session.expose.message;
		}
		if(req.session.message){
			req.session.expose.message = req.session.message;
			delete req.session.message;	
		}
		if(req.session.expose.error){
			delete req.session.expose.error;
		}
		if(req.session.error){
			req.session.expose.error = req.session.error;
			delete req.session.error;	
		}
		res.locals.RolesHelper = RolesHelper;
		res.locals.util = util;
		res.locals.expose = req.session.expose;
		next();
	});

	// development only
	if ('development' == app.get('env')) {
		app.use(express.errorHandler());
	}

	mailer.extend(app, {
		from: private_config.mail_user,
		host: 'smtp.gmail.com', // hostname
		secureConnection: true, // use SSL
		port: 465, // port for secure SMTP
		transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
		auth: {
			user: private_config.mail_user,
			pass:  private_config.mail_password,
		}
	});

	
}
