var UserModel 	= require('../models/user').UserModel;
var UserRoles 	= require('../models/user').UserRoles;
var ImageModel 	= require('../models/image').ImageModel;
var jwt = require('jsonwebtoken');
var encrypter = require('../helpers/encryption');
var mongoose = require('mongoose');
var private_config = require('../private_config');
module.exports = function(app){


	// RESTful routes
	app.get('/sapi/users', function(req, res, next){
		var models = Models(req.tenant);
		console.log(req.body.token)
		UserModel.find().exec( function(err, users){
			if (err) throw err;
			res.send(users);
		});
	});

	app.get('/sapi/users/:id', function(req, res, next){
		var models = Models(req.tenant);
		UserModel.findOne({ _id: req.params.id }).exec( function(err, user){
			if (err) throw err;
			res.send(user);
		});
	});

	app.post('/sapi/users', function(req, res){
		var models = Models(req.tenant);
		var user = new UserModel(req.body.user);
		user.save(function(err){
			if(err) throw err;
			req.send(user);
		});
	});

	app.put('/sapi/users/:id', function(req, res, next){
		var models = Models(req.tenant);
		UserModel.findOne({ _id: req.params.id }).exec( function(err, user){
			if (err) throw err;
			if(user){
				user.name = req.body.user.name;
				user.modified = new Date();
				user.save(function(err){
					if (err) throw err;
					res.send(user);
				});
			}
		});
	});

	app.delete('/sapi/users/:id', function(req, res, next){
		var models = Models(req.tenant);
		UserModel.remove({ _id: req.params.id }).exec( function(err, user){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes

	app.post('/login', function(req, res, next){
		UserModel.findOne({'username': req.body.username}, function(err, user){
			if(!err){
				
				if( encrypter.decrypt(user.encrypted_password) == req.body.password){
					
					var profile = user;
					
					var token = jwt.sign(profile, private_config.secret_sauce, { expiresInMinutes: 60*5 });

					res.json({ token: token });
				}else{
					res.send(401,{ error: 'Nombre de usuario o contraseña erróneas' });
				}
			}else{
				console.log('Failed login');
				res.send(401,{ error: 'Nombre de usuario o contraseña erróneas' });
			}
		});
	});

	app.post('/resetPassword', function(req, res, next){
		var models = Models(req.tenant);
		UserModel.findOne({username: req.body.username}, function(err, user){
			if(!err){
				var encrypted_password = encrypter.encrypt(req.body.password);
				UserModel.update({ '_id' : user._id},{$set:{'encrypted_password': encrypted_password}}, function(){
					console.log('Guardado')
				})
			}else{
				console.log('Failed');
			}
		});
	});

	app.post('/roles', function(req, res, next){
		var models = Models(req.tenant);
		UserModel.findOne({username: req.body.username}, function(err, user){
			if(!err){
				var encrypted_password = encrypter.encrypt(req.body.password);
				UserModel.update({ '_id' : user._id},{$push:{'roles': req.body.role}}, function(){
					console.log('Guardado')
				})
			}else{
				console.log('Failed');
			}
		});
	});
}
