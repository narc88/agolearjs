var TeamModel = require('../models/team').TeamModel;
var SuspensionModel = require('../models/suspension').SuspensionModel;
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/teams', function(req, res, next){
		TeamModel.find().exec( function(err, teams){
			if (err) throw err;
			res.send(teams);
		});
	});

	app.get('/api/teams/:id/players', function(req, res, next){
		TeamModel.findOne({_id : req.params.id}).populate('players', 'name last_name dni').exec( function(err, team){
			if (err) throw err;
			res.send(team.players);
		});
	});

	app.get('/api/teamNames', function(req, res, next){
		TeamModel.find({}, 'name').exec( function(err, teams){
			if (err) throw err;
			res.send(teams);
		});
	});

	app.get('/api/teams/:id', function(req, res, next){
		TeamModel.findOne({ _id: req.params.id }).populate("players", "name last_name").exec( function(err, team){
			if (err) throw err;
			res.send(team);
		});
	});

	app.post('/api/teams', function(req, res){
		console.log(req.body)
		var team = new TeamModel(req.body);
		team.validate(function(error) {
		    if (error) {
		      	res.send({ error : error });
		    } else {
		    	team.save(function(err){
					if(err) throw err;
					res.send(team);
				});
			}
		});
	});

	app.put('/api/teams/:id', function(req, res, next){
		TeamModel.findOne({ _id: req.params.id }).exec( function(err, team){
			if (err) throw err;
			if(team){
				team.name = req.body.team.name;
				team.modified = new Date();
				team.save(function(err){
					if (err) throw err;
					res.send(team);
				});
			}
		});
	});

	app.delete('/api/teams/:id', function(req, res, next){
		TeamModel.remove({ _id: req.params.id }).exec( function(err, team){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes

	//Prohibition for all players and team
	app.post('/api/teams/:id/suspension', function(req, res){
		console.log(req.body.reason)
		var players = req.body.players;
		var callback = function(err, numAffected, status){
			if(err) throw err;
			res.send(players);
		}
		for (var i = 0; i < players.length; i++) {
			var suspension = new SuspensionModel();
			suspension.reason = req.body.reason;
			suspension.undetermined_time = true;
			suspension.player = players[i];
			suspension.save(function(err){
				console.log("Suspension for player"+suspension.player);
			})
		};
		var suspension = new SuspensionModel();
		suspension.reason = req.body.reason;
		suspension.undetermined_time = true;
		TeamModel.update(
		    { "_id": req.params.id}, 
		    {$push: {"suspensions" : suspension }}, callback
		)
	});

	app.delete('/api/teams/:team_id/suspension', function(req, res, next){
		var callback = function(err, numAffected, status){
			if(err) throw err;
			res.send(req.params.team_id);
		}
		TeamModel.update(
				   { _id: req.params.team_id, "suspensions.accomplished": false },
				   { $set: { "suspensions.$.accomplished" : true } }, callback
		)
	});
}
