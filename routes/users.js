var UserModel 	= require('../models/user').UserModel;
var UserRoles 	= require('../models/user').UserRoles;
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/users', function(req, res, next){
		UserModel.find().exec( function(err, users){
			if (err) throw err;
			res.send(users);
		});
	});

	app.get('/api/users/:id', function(req, res, next){
		UserModel.findOne({ _id: req.params.id }).exec( function(err, user){
			if (err) throw err;
			res.send(user);
		});
	});

	app.post('/api/users', function(req, res){
		var user = new UserModel(req.body.user);
		user.save(function(err){
			if(err) throw err;
			req.send(user);
		});
	});

	app.put('/api/users/:id', function(req, res, next){
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

	app.delete('/api/users/:id', function(req, res, next){
		UserModel.remove({ _id: req.params.id }).exec( function(err, user){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
