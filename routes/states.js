var Models = require('../model_factory');
var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/states', function(req, res, next){
		var models = Models(req.tenant);
		models.state.find().exec( function(err, states){
			if (err) throw err;
			res.send(states);
		});
	});

	app.get('/api/states/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.state.findOne({ _id: req.params.id }).exec( function(err, state){
			if (err) throw err;
			res.send(state);
		});
	});

	app.post('/api/states', function(req, res){
		var models = Models(req.tenant);
		var state = new models.state(req.body.state);
		state.save(function(err){
			if(err) throw err;
			req.send(state);
		});
	});

	app.put('/api/states/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.state.findOne({ _id: req.params.id }).exec( function(err, state){
			if (err) throw err;
			if(state){
				state.name = req.body.state.name;
				state.modified = new Date();
				state.save(function(err){
					if (err) throw err;
					res.send(state);
				});
			}
		});
	});

	app.delete('/api/states/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.state.remove({ _id: req.params.id }).exec( function(err, state){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
