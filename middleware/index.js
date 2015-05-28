var path = require('path');
var express = require('express');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var private_config = require('../private_config');
var mailer = require('express-mailer');
var ImageHelper	= require('../helpers/imageHelper');
var RolesHelper	= require('../helpers/checkAuth');
var util = require('../helpers/util');

module.exports = function(app){

	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(express.static(path.join(__dirname, '../public')));
	app.set('photos',path.join(__dirname,'../public/photos/'));
	app.use('/sapi', expressJwt({secret: private_config.secret_sauce}));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(function (req, res, next) {
		console.log('Host is'+req.host)	
		if(req.host == 'localhost'){
			req.tenant = 'agolear' || 'ligaaltosdelparacao';
		}
		try {
		 	if(req.headers.authorization){
				res.locals.user = jwt.decode(req.headers.authorization.split(" ")[1], true )
			}
		} catch(err) {
		  console.log(err)
		}
		res.locals.RolesHelper = RolesHelper;
		res.locals.util = util;
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
