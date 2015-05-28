var Models = require('../model_factory');
var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/matchdays', function(req, res, next){
		var models = Models(req.tenant);
		models.matchday.find().exec( function(err, matchdays){
			if (err) throw err;
			res.send(matchdays);
		});
	});

	
	app.get('/api/matchdays/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.matchday.findOne({ _id: req.params.id }).exec( function(err, matchday){
			if (err) throw err;
			res.send(matchday);
		});
	});

	app.post('/sapi/matchdays', function(req, res){
		var models = Models(req.tenant);
		var matchday = new models.matchday(req.body.matchday);
		matchday.save(function(err){
			if(err) throw err;
			req.send(matchday);
		});
	});

	app.put('/sapi/matchdays/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.matchday.findOne({ _id: req.params.id }).exec( function(err, matchday){
			if (err) throw err;
			if(matchday){
				matchday.name = req.body.matchday.name;
				matchday.modified = new Date();
				matchday.save(function(err){
					if (err) throw err;
					res.send(matchday);
				});
			}
		});
	});

	app.delete('/sapi/matchdays/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.matchday.remove({ _id: req.params.id }).exec( function(err, matchday){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
