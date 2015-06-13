var Models = require('../model_factory');
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/advertisings', function(req, res, next){
		var models = Models(req.tenant);
		models.advertising.find(req.query).exec( function(err, advertisings){
			if (err) throw err;
			res.send(advertisings);
		});
	});

	app.get('/api/advertisings/admin', function(req, res, next){
		var models = Models('admin');
		models.advertising.find(req.query).exec( function(err, advertisings){
			if (err) throw err;
			res.send(advertisings);
		});
	});

	app.get('/api/advertisings/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.advertising.findOne({ _id: req.params.id }).exec( function(err, advertising){
			if (err) throw err;
			res.send(advertising);
		});
	});

	app.post('/sapi/advertisings', function(req, res){
		var models = Models(req.tenant);
		var advertising = new models.advertising(req.body)
		advertising.save(function(err){
			if(err) throw err;
			res.send(advertising);
		});
	});

	app.put('/sapi/advertisings/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.advertising.findOne({ _id: req.params.id }).exec( function(err, advertising){
			if (err) throw err;
			if(advertising){
				advertising.title = req.body.advertising.title;
				advertising.description = req.body.advertising.description;
				advertising.type = req.body.advertising.type;
				advertising.link = req.body.advertising.link;
				advertising.expiration = req.body.advertising.expiration;
				advertising.modified = new Date();
				advertising.save(function(err){
					if (err) throw err;
					res.send(advertising);
				});
			}
		});
	});

	app.delete('/sapi/advertisings/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.advertising.remove({ _id: req.params.id }).exec( function(err, advertising){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
