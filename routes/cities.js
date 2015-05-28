var Models = require('../model_factory');

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/cities', function(req, res, next){
		var models = Models(req.tenant);
		models.city.find().exec( function(err, cities){
			if (err) throw err;
			res.send(cities);
		});
	});

	app.get('/api/cities/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.city.findOne({ _id: req.params.id }).exec( function(err, city){
			if (err) throw err;
			res.send(city);
		});
	});

	app.post('/api/cities', function(req, res){
		var models = Models(req.tenant);
		var city = new models.city(req.body.city);
		city.save(function(err){
			if(err) throw err;
			req.send(city);
		});
	});

	app.put('/api/cities/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.city.findOne({ _id: req.params.id }).exec( function(err, city){
			if (err) throw err;
			if(city){
				city.name = req.body.city.name;
				city.modified = new Date();
				city.save(function(err){
					if (err) throw err;
					res.send(city);
				});
			}
		});
	});

	app.delete('/api/cities/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.city.remove({ _id: req.params.id }).exec( function(err, city){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
