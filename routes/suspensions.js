var Models = require('../model_factory');
var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/suspensions', function(req, res, next){
		var models = Models(req.tenant);
		models.suspension.find({'accomplished':false}).populate('player', 'name last_name').exec( function(err, suspensions){
			if (err) throw err;
			console.log(suspensions.length)
			res.send(suspensions);
		});
	});

	app.get('/api/suspensions/accomplished', function(req, res, next){
		var models = Models(req.tenant);
		models.suspension.find({'accomplished':true}).populate('player', 'name last_name').exec( function(err, suspensions){
			if (err) throw err;
			console.log(suspensions.length)
			res.send(suspensions);
		});
	});

	app.get('/api/suspendedTeams', function(req, res, next){
		var models = Models(req.tenant);
		var team_ids = [];
		models.team.find({'suspensions.accomplished' : false}).exec( function(err, teams){
			if (err) throw err;
			for (var i = 0; i < teams.length; i++) {
				team_ids.push(teams[i]._id)
			};
			res.send(team_ids);
		});
	});

	//Reacondicionar
	app.get('/api/suspensionsByTeam', function(req, res, next){
		var models = Models(req.tenant);
		var team_id = req.query.team
		models.team.findOne({"_id":team_id}).exec( function(err, team){
			if (err) throw err;
			if(team.players.length > 0){
				players = team.players;
				models.suspension.find({ "accomplished" : false,"player":{$in : players }}).populate("player").exec( function(err, suspensions){
					if (err) throw err;
					res.send(suspensions);
				});
			}else{
				res.send();
			}
			
		});
		
	});

	app.get('/api/suspensions/suspendedPlayers', function(req, res, next){
		var models = Models(req.tenant);
		models.suspension.find({ "accomplished": false }).exec( function(err, suspensions){
			if (err) throw err;
			var suspended =[];
			for (var i = suspensions.length - 1; i >= 0; i--) {
				suspended.push(suspensions[i].player)
			};
			res.send(suspended);
		});
	});

	//Called from matches view
	app.post('/sapi/suspensions/:role/:id', function(req, res, next){
		var models = Models(req.tenant);
		var match_role = '';
		if(req.params.role === "local"){
			match_role = "local_suspension";
		}else if(req.params.role === "visitor"){
			match_role = "visitor_suspension";
		}
		models.match.findOne({ _id: req.params.id }).exec( function(err, match){
			if (err) throw err;
			if(match){
				var suspension = new SuspensionModel(req.body);
				suspension.match = match._id;
				if(match_role === "local_suspension"){
					match.local_suspensions.push(suspension._id);
				}else{			
					if(match_role === "visitor_suspension"){
						match.visitor_suspensions.push(suspension._id);
					}
				}
				match.save(function(err){
					if (err) throw err;
					suspension.save(function(err){
						if (err) throw err;
						res.send(suspension);
					})
				});
			}
		});
	});

	app.put('/sapi/suspensions/setAsAccomplished', function(req, res, next){
		var models = Models(req.tenant);
		models.suspension.findOne({ _id: req.body.suspension._id }).exec( function(err, suspension){
			if (err) throw err;
			if(suspension){
				suspension.accomplished = true;
				suspension.save(function(err){
					if (err) throw err;
					res.send(true);
				});
			}
		});
	});
	

	app.put('/sapi/suspensions/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.suspension.findOne({ _id: req.params.id }).exec( function(err, suspension){
			if (err) throw err;
			if(suspension){
				suspension.name = req.body.suspension.name;
				suspension.modified = new Date();
				suspension.save(function(err){
					if (err) throw err;
					res.send(suspension);
				});
			}
		});
	});

	app.delete('/sapi/suspensions/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.suspension.remove({ _id: req.params.id }).exec( function(err, suspension){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
