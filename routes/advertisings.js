var AdvertisingModel 	= require('../models/advertising').AdvertisingModel;
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/advertisings', function(req, res, next){
		AdvertisingModel.find(req.query).exec( function(err, advertisings){
			if (err) throw err;
			res.send(advertisings);
		});
	});

	app.get('/api/advertisings/:id', function(req, res, next){
		AdvertisingModel.findOne({ _id: req.params.id }).exec( function(err, advertising){
			if (err) throw err;
			res.send(advertising);
		});
	});

	app.post('/api/advertisings', function(req, res){
		var advertising = new AdvertisingModel(req.body)
		advertising.save(function(err){
			if(err) throw err;
			res.send(advertising);
		});
	});

	app.put('/api/advertisings/:id', function(req, res, next){
		AdvertisingModel.findOne({ _id: req.params.id }).exec( function(err, advertising){
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

	app.delete('/api/advertisings/:id', function(req, res, next){
		AdvertisingModel.remove({ _id: req.params.id }).exec( function(err, advertising){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
