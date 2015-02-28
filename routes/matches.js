var MatchModel = require('../models/match').MatchModel;
var GoalModel = require('../models/goal').GoalModel;
var IncidentModel = require('../models/incident').IncidentModel;
var ImageModel 	= require('../models/image').ImageModel;
var FieldModel = require('../models/field').FieldModel;
var PlayerModel = require('../models/player').PlayerModel;
var mongoose = require('mongoose');

module.exports = function(app){

	// RESTful routes
	app.get('/api/matches', function(req, res, next){
		MatchModel.find(req.query).populate("visitor_team").populate("local_team").exec( function(err, matches){
			if (err) throw err;
			var callback = function(){
				res.send(matches);
			}
			FieldModel.populate(matches, { path: 'turn.field', select: 'name'},callback);
		});
	});

	app.get('/api/matchesLastPlayed', function(req, res, next){
		var team_id = req.query.team
		MatchModel.find(req.query).sort({'start_datetime': -1}).limit(5).exec( function(err, matches){
			if (err) throw err;
			var callback = function(){
				res.send(matches);
			}
			FieldModel.populate(matches, { path: 'turn.field', select: 'name'},callback);
		});
	});

	app.get('/api/matches/:id', function(req, res, next){
		MatchModel.findOne({ _id: req.params.id }).populate("visitor_team").populate("local_team").populate("local_suspensions").populate("visitor_suspensions").exec( function(err, match){
			if (err) throw err
			console.log(match)
			FieldModel.populate(match, { path: 'turn.field', select: 'name'}, function(){
				res.send(match)
			});
		});
	});

	app.post('/api/matches/setMatchAsPlayed', function(req, res){
		MatchModel.findOne({ _id: req.body.match_id }).exec(function(err, match){
			if(!match.played){
				SuspensionModel.find({ "accomplished": false }).exec(function(err, suspensions){
					if(err) throw err;
					for (var i = suspensions.length - 1; i >= 0; i--) {
						suspensions[i].matches.push(match._id);
						if(suspensions[i].matches.length >= suspensions[i].number_of_matches){
							suspensions[i].accomplished = true;
						}
						suspensions[i].save();
					};
				});
				match.played = true;
				match.save(function(err){
					if(err) throw err;
					req.send(match);
				});
			}
			
		})
		
	});

	app.put('/api/matches/:id', function(req, res, next){
		MatchModel.findOne({ _id: req.params.id }).exec( function(err, match){
			if (err) throw err;
			if(match){
				match.name = req.body.match.name;
				match.modified = new Date();
				match.save(function(err){
					if (err) throw err;
					res.send(match);
				});
			}
		});
		//TODO: Cada vez que guardo necesito levantar los partidos jugados para esta zona y actualizar los valores.
	});

	app.delete('/api/matches/:id', function(req, res, next){
		MatchModel.remove({ _id: req.params.id }).exec( function(err, match){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes

	//Routes for embedded elements
	app.post('/api/matches/goals/:team_role/:id', function(req, res){
		var team_role = ""
		var goal = new GoalModel(req.body);
		var callback = function(err, numAffected, status){
			if(err) throw err;
			res.send(goal);
		}
		
		MatchModel.findOne({ "_id": req.params.id}).exec(function (err, match){
		 	if(req.params.team_role === "local"){
				match.local_goals.push(goal);
			}else{			
				if(req.params.team_role === "visitor"){
					match.visitor_goals.push(goal);
				}
			}

			if(match.local_goals.length > match.visitor_goals.length){
				console.log("localWinner")
				match.winner = match.local_team;
			}else if(match.local_goals.length < match.visitor_goals.length){
				console.log("visitorWinner")
				match.winner = match.visitor_team;
			}else if(match.local_goals.length == match.visitor_goals.length){
				console.log("tiedMatch")
				match.winner = undefined;
			}
			console.log(match)
			match.save(function(err){
				if(err) throw err;
				res.send(match);
			})
		
		});
		
	});

	app.delete('/api/matches/goals/:team_role/:id', function(req, res, next){
		var team_role = ""
		var id = mongoose.Types.ObjectId(req.params.id);
		if(req.params.team_role === "local"){
			team_role = "local_goals";
			var callback = function(err, numAffected, status){
					if(err) throw err;
					res.send(true);
				}
			MatchModel.update(
			    { "local_goals._id": id}, 
			    {$pull: {"local_goals" :{_id : id }}}, callback
			)
		}else{
			if(req.params.team_role === "visitor"){
				team_role = "visitor_goals";
				var callback = function(err, numAffected, status){
					if(err) throw err;
					res.send(true);
				}
				MatchModel.update(
				    { "visitor_goals._id": id}, 
				    {$pull: {"visitor_goals" :{_id : id }}}, callback
				)
			}			
		}
		
	});

	app.post('/api/matches/incidents/:team_role/:id/:tournament_id', function(req, res){
		var team_role = ""
		var incident = new IncidentModel(req.body);
		var id = mongoose.Types.ObjectId(req.params.id);
		var callback = function(err, numAffected, status){
			if(err) throw err;
			res.send(goal);
		}
		if(req.params.team_role === "local"){
			MatchModel.update(
			    { "_id": req.params.id}, 
			    {$push: {"local_incidents": incident}}, callback
			)
		}else{			
			if(req.params.team_role === "visitor"){
				MatchModel.update(
				    { "_id": req.params.id}, 
				    {$push: {"visitor_incidents": incident}}, callback
				)
			}
		}
		TournamentModel.find({"_id": req.params.tournament_id}).exec( function(err, tournament){
			if (err) throw err;
			MatchModel.find({"_id" : id}).exec( function(err, match){
				if (err) throw err;
				ZoneModel.findOne({ "zones.tournament": req.params.tournament_id }).exec( function(err, zones){
					if (err) throw err;
					for (var i = 0; i < zones.length; i++) {
						matchdays = matchdays.concat(zones[i].matchdays);
					};
					if (err) throw err;
					MatchModel.aggregate(
						{ $match: {"matchday" : { $in : matchdays }, "played" : true , $or: [ {"visitor_team" : participant_id } , {"local_team" : participant_id }]}},
						{ $unwind : "$local_incidents" },
						{ $unwind : "$visitor_incidents" },
						function (err, matches_with_incidents){
							if (err) throw err;
							var yellow_card = 0;
							var red_card = 0;
							for (var i = 0; i < matches_with_incidents.length; i++) {
								if(matches_with_incidents[i].type == "Amonestación"){
									yellow_card++;
								}
								if(matches_with_incidents[i].type == "Expulsión"){
									red_card++;
								}
							};
							if( (yellow_card % tournament.yellow_card_limit) === 0 ){
								var suspension = new SuspensionModel();
								suspension.player = incident.player;
								suspension.player = match._id;
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
										if(err) throw err;
										res.send(suspension);
									});
								});
							}
						});
				});
			});
		});
	});

	app.delete('/api/matches/incidents/:team_role/:id', function(req, res, next){
		var team_role = ""
		var id = mongoose.Types.ObjectId(req.params.id);
		if(req.params.team_role === "local"){
			team_role = "local_incidents";
			MatchModel.update(
			    { "local_incidents._id": id}, 
			    {$pull: {"local_incidents" :{_id : id }}}, callback)
		}else{
			if(req.params.team_role === "visitor"){
				team_role = "visitor_incidents";
				MatchModel.update(
				    { "visitor_incidents._id": id}, 
				    {$pull: {"visitor_incidents" :{_id : id }}}, callback)
			}			
		}
		
		var callback = function(err, numAffected, status){
			if(err) throw err;
			res.send(true);
		}
		
	});

	app.post('/api/matches/:team_role/:id/players', function(req, res){
		var team_role = ""
		if(req.params.team_role === "local"){
			team_role = "local_goals";
		}else{
			if(req.params.team_role === "visitor"){
				team_role = "visitor_goals";
			}			
		}
		var callback = function(err, numAffected, status){
			if(err) throw err;
			req.send(true);
		}
		MatchModel.update(
		    { _id: req.params.id}, 
		    {$push: {$each:{team_role: req.body.players}}}, callback)
	});

	app.delete('/api/matches/:team_role/:id/players/:player_id', function(req, res, next){
		var callback = function(err, numAffected, status){
			if(err) throw err;
			req.send(true);
		}
		if(req.params.team_role === "Local"){
			team_role = "local_players";
		}else{			
			if(req.params.team_role === "Visitor"){
				team_role = "visitor_players";
			}
		}
		MatchModel.update(
		    { "_id": req.params.match_id}, 
		    {$pull: {team_role : req.params.id }}, callback
		)
	});
}
