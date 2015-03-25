var TurnModel = require('../models/turn').TurnModel;
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/turns', function(req, res, next){
		TurnModel.find().populate('field').exec( function(err, turns){
			if (err) throw err;
			res.send(turns);
		});
	});

	app.get('/api/turns/:id', function(req, res, next){
		TurnModel.findOne({ _id: req.params.id }).exec( function(err, turn){
			if (err) throw err;
			res.send(turn);
		});
	});

	app.post('/api/turns', function(req, res){
		console.log(req.body)
		var turn = new TurnModel(req.body);
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

	app.put('/api/turns/:id', function(req, res, next){
		TurnModel.findOne({ _id: req.params.id }).exec( function(err, turn){
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

	app.delete('/api/turns/:id', function(req, res, next){
		TurnModel.remove({ _id: req.params.id }).exec( function(err, turn){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
