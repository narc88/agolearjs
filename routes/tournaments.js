var TournamentModel = require('../models/tournament').TournamentModel;
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/tournaments', function(req, res, next){
		TournamentModel.find().exec( function(err, tournaments){
			if (err) throw err;
			res.send(tournaments);
		});
	});

	app.get('/api/tournaments/:id', function(req, res, next){
		TournamentModel.findOne({ _id: req.params.id }).exec( function(err, tournament){
			if (err) throw err;
			res.send(tournament);
		});
	});

	app.post('/api/tournaments', function(req, res){
		var tournament = new TournamentModel(req.body.tournament);
		tournament.save(function(err){
			if(err) throw err;
			req.send(tournament);
		});
	});

	app.put('/api/tournaments/:id', function(req, res, next){
		TournamentModel.findOne({ _id: req.params.id }).exec( function(err, tournament){
			if (err) throw err;
			if(tournament){
				tournament.name = req.body.tournament.name;
				tournament.modified = new Date();
				tournament.save(function(err){
					if (err) throw err;
					res.send(tournament);
				});
			}
		});
	});

	app.delete('/api/tournaments/:id', function(req, res, next){
		TournamentModel.remove({ _id: req.params.id }).exec( function(err, tournament){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
