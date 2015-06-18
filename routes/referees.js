var Models = require('../model_factory');
var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/referees', function(req, res, next){
		var models = Models(req.tenant);
		models.referee.find().exec( function(err, referees){
			if (err) throw err;
			res.send(referees);
		});
	});

	app.get('/api/referees/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.referee.findOne({ _id: req.params.id }).exec( function(err, referee){
			if (err) throw err;
			res.send(referee);
		});
	});

	app.post('/sapi/referees', function(req, res){
		var models = Models(req.tenant);
		console.log(req.body)
		var referee = new models.referee(req.body.referee);
		referee.validate(function(error) {
		    if (error) {
		      	res.send({ error : error });
		    } else {
		    	referee.save(function(err){
					if(err) throw err;
					res.send(referee);
				});
			}
		});
	});

	app.put('/sapi/referees/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.referee.findOne({ _id: req.params.id }).exec( function(err, referee){
			if (err) throw err;
			if(referee){
				referee.name = req.body.referee.name;
				referee.last_name = req.body.referee.last_name;
				referee.modified = new Date();
				referee.save(function(err){
					if (err) throw err;
					res.send(referee);
				});
			}
		});
	});

	app.delete('/sapi/referees/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.referee.remove({ _id: req.params.id }).exec( function(err, referee){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
