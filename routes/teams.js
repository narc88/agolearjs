var Models = require('../model_factory');
var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/teams', function(req, res, next){
		var models = Models(req.tenant);
		models.team.find().sort( { name: 1 } ).exec( function(err, teams){
			if (err) throw err;
			res.send(teams);
		});
	});

	app.get('/api/teams/:id/players', function(req, res, next){
		var models = Models(req.tenant);
		models.team.findOne({_id : req.params.id}).populate('players', 'name last_name dni').sort( { 'players.name': 1,'players.last_name': 1 } ).exec( function(err, team){
			if (err) throw err;
			res.send(team.players);
		});
	});

	app.get('/api/teamNames', function(req, res, next){
		var models = Models(req.tenant);
		models.team.find({}, 'name').exec( function(err, teams){
			if (err) throw err;
			res.send(teams);
		});
	});

	app.get('/api/teams/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.team.findOne({ _id: req.params.id }).populate("players").exec( function(err, team){
			if (err) throw err;
			res.send(team);
		});
	});

	app.post('/sapi/teams', function(req, res){
		var models = Models(req.tenant);
		console.log(req.body)
		var team = new models.team(req.body);
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

	app.put('/sapi/teams/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.team.findOne({ _id: req.params.id }).exec( function(err, team){
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

	app.delete('/sapi/teams/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.team.remove({ _id: req.params.id }).exec( function(err, team){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes

	//Prohibition for all players and team
	app.post('/sapi/teams/:id/suspension', function(req, res){
		var models = Models(req.tenant);
		console.log(req.body.reason)
		var players = req.body.players;
		var callback = function(err, numAffected, status){
			if(err) throw err;
			res.send(players);
		}
		for (var i = 0; i < players.length; i++) {
			var suspension = new models.suspension();
			suspension.reason = req.body.reason;
			suspension.undetermined_time = true;
			suspension.player_team = req.params.id;
			suspension.player = players[i];
			suspension.save(function(err){
				console.log("Suspension for player"+suspension.player);
			})
		};
		var suspension = new models.suspension();
		suspension.reason = req.body.reason;
		suspension.undetermined_time = true;
		models.team.update(
		    { "_id": req.params.id}, 
		    {$push: {"suspensions" : suspension }}, callback
		)
	});

	app.delete('/sapi/teams/:team_id/suspension', function(req, res, next){
		var models = Models(req.tenant);
		var callback = function(err, numAffected, status){
			if(err) throw err;
			res.send(req.params.team_id);
		}
		var callback2 = function(err, numAffected, status){
			if(err) throw err;
			models.suspension.update(
			   { 'player_team': req.params.team_id, "suspensions.accomplished": false },
			   { $set: { "suspensions.$.accomplished" : true } }, callback);
		}
		models.team.update(
		   { _id: req.params.team_id, "suspensions.accomplished": false },
		   { $set: { "suspensions.$.accomplished" : true } }, callback2);
		
	});

}
