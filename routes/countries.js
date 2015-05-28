var Models = require('../model_factory');
var CheckAuth = require('../middleware/checkAuth');
var _ = require('underscore');

module.exports = function(app){

	// RESTful routes
	app.get('/api/countries', function(req, res, next){
		var models = Models(req.tenant);
		models.country.find().exec( function(err, countries){
			if (err) throw err;
			res.send(countries);
		});
	});

	app.get('/api/countries/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.country.findOne({ _id: req.params.id }).exec( function(err, country){
			if (err) throw err;
			res.send(country);
		});
	});

	app.post('/api/countries', function(req, res){
		var models = Models(req.tenant);
		var country = new models.country(req.body.country);
		country.save(function(err){
			if(err) throw err;
			req.send(country);
		});
	});

	app.put('/api/countries/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.country.findOne({ _id: req.params.id }).exec( function(err, country){
			if (err) throw err;
			if(country){
				country.name = req.body.country.name;
				country.modified = new Date();
				country.save(function(err){
					if (err) throw err;
					res.send(country);
				});
			}
		});
	});

	app.delete('/api/countries/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.country.remove({ _id: req.params.id }).exec( function(err, country){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
