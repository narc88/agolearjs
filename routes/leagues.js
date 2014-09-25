var LeagueModel = require('../models/league').LeagueModel;
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/leagues', function(req, res, next){
		LeagueModel.find().exec( function(err, leagues){
			if (err) throw err;
			res.send(leagues);
		});
	});

	app.get('/api/leagues/:id', function(req, res, next){
		LeagueModel.findOne({ _id: req.params.id }).exec( function(err, league){
			if (err) throw err;
			res.send(league);
		});
	});

	app.post('/api/leagues', function(req, res){
		var league = new LeagueModel(req.body.league);
		league.save(function(err){
			if(err) throw err;
			req.send(league);
		});
	});

	app.put('/api/leagues/:id', function(req, res, next){
		LeagueModel.findOne({ _id: req.params.id }).exec( function(err, league){
			if (err) throw err;
			if(league){
				league.name = req.body.league.name;
				league.modified = new Date();
				league.save(function(err){
					if (err) throw err;
					res.send(league);
				});
			}
		});
	});

	app.delete('/api/leagues/:id', function(req, res, next){
		LeagueModel.remove({ _id: req.params.id }).exec( function(err, league){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
