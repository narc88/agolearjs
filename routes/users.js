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

	//Authentication routes
	app.post('/authenticate', function(req, res) {
	    UserModel.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
	        if (err) {
	            res.json({
	                type: false,
	                data: "Error occured: " + err
	            });
	        } else {
	            if (user) {
	               res.json({
	                    type: true,
	                    data: user,
	                    token: user.token
	                });
	            } else {
	                res.json({
	                    type: false,
	                    data: "Incorrect email/password"
	                });   
	            }
	        }
	    });
	});

	app.post('/signin', function(req, res) {
	    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
	        if (err) {
	            res.json({
	                type: false,
	                data: "Error occured: " + err
	            });
	        } else {
	            if (user) {
	                res.json({
	                    type: false,
	                    data: "User already exists!"
	                });
	            } else {
	                var userModel = new User();
	                userModel.email = req.body.email;
	                userModel.password = req.body.password;
	                userModel.save(function(err, user) {
	                    user.token = jwt.sign(user, process.env.JWT_SECRET);
	                    user.save(function(err, user1) {
	                        res.json({
	                            type: true,
	                            data: user1,
	                            token: user1.token
	                        });
	                    });
	                })
	            }
	        }
	    });
	});

	app.get('/me', ensureAuthorized, function(req, res) {
	    User.findOne({token: req.token}, function(err, user) {
	        if (err) {
	            res.json({
	                type: false,
	                data: "Error occured: " + err
	            });
	        } else {
	            res.json({
	                type: true,
	                data: user
	            });
	        }
	    });
	});
}
