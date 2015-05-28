var Models = require('../model_factory');
var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/turns', function(req, res, next){
		var models = Models(req.tenant);
		models.turn.find().populate('field').exec( function(err, turns){
			if (err) throw err;
			res.send(turns);
		});
	});

	app.get('/api/turns/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.turn.findOne({ _id: req.params.id }).exec( function(err, turn){
			if (err) throw err;
			res.send(turn);
		});
	});

	app.post('/sapi/turns', function(req, res){
		var models = Models(req.tenant);
		console.log(req.body)
		var turn = new models.turn(req.body);
		turn.validate(function(error) {
		    if (error) {
		      	res.send({ error : error });
		    } else {
		    	turn.save(function(err){
					if(err) throw err;
					res.send(turn);
				});
			}
		});
	});

	app.put('/sapi/turns/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.turn.findOne({ _id: req.params.id }).exec( function(err, turn){
			if (err) throw err;
			if(turn){
				turn.hour = req.body.hour;
				turn.day = req.body.day;
				turn.minute = req.body.minute;
				turn.field = req.body.field;
				turn.modified = new Date();
				turn.save(function(err){
					if (err) throw err;
					res.send(turn);
				});
			}
		});
	});

	app.delete('/sapi/turns/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.turn.remove({ _id: req.params.id }).exec( function(err, turn){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
