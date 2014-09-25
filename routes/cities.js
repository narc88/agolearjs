var CityModel 	= require('../models/city').CityModel;
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/cities', function(req, res, next){
		CityModel.find().exec( function(err, cities){
			if (err) throw err;
			res.send(cities);
		});
	});

	app.get('/api/cities/:id', function(req, res, next){
		CityModel.findOne({ _id: req.params.id }).exec( function(err, city){
			if (err) throw err;
			res.send(city);
		});
	});

	app.post('/api/cities', function(req, res){
		var city = new CityModel(req.body.city);
		city.save(function(err){
			if(err) throw err;
			req.send(city);
		});
	});

	app.put('/api/cities/:id', function(req, res, next){
		CityModel.findOne({ _id: req.params.id }).exec( function(err, city){
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
		CityModel.remove({ _id: req.params.id }).exec( function(err, city){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
