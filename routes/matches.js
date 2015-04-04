var MatchModel = require('../models/match').MatchModel;
var GoalModel = require('../models/goal').GoalModel;
var IncidentModel = require('../models/incident').IncidentModel;
var ImageModel 	= require('../models/image').ImageModel;
var FieldModel = require('../models/field').FieldModel;
var PlayerModel = require('../models/player').PlayerModel;
var ZoneModel = require('../models/zone').ZoneModel;
var TurnModel = require('../models/turn').TurnModel;
var TournamentModel = require('../models/tournament').TournamentModel;
var DataGrouper = require('../helpers/dataGrouper').DataGrouper;
var mongoose = require('mongoose');

module.exports = function(app){

	// RESTful routes
	app.get('/api/matches', function(req, res, next){
		console.log(req.query)
		MatchModel.find(req.query).populate("visitor_team").populate("local_team").exec( function(err, matches){
			if (err) throw err;
			res.send(matches);
		});
	});

	//Crear un nuevo partido, amistoso, quizá?
	app.post('/api/matches', function(req, res, next){
		MatchModel.findOne({ '_id': req.body._id }).exec( function(err, match){
			if (err) throw err;
			res.send(match);
		});
	});

	app.get('/api/matchesLastPlayed', function(req, res, next){
		var team_id = req.query.team
		MatchModel.find(req.query).sort({'start_datetime': -1}).limit(5).exec( function(err, matches){
			if (err) throw err;
			res.send(matches);
		});
	});

	app.get('/api/participators_stats/:tournament_id', function(req, res, next){
		var groupByPlayer = function(arr){
		    var a = [], b = [], prev = "";
		    arr.sort();
		    for ( var i = 0; i < arr.length; i++ ) {
		        if ( arr[i].toString() != prev ) {
		        	obj = {}
			    	obj.key = arr[i];
			        obj.value = 1;
			        a.push(obj)
		        } else {
		            a[a.length-1].value ++;
		        }
		        prev = obj.key;
		    }
		    function compare(a,b) {
			  if (a.value < b.value)
			     return 1;
			  if (a.value > b.value)
			    return -1;
			  return 0;
			}
			var top_scorers = a.sort(compare).slice(0, 10);
		    return top_scorers;
		  }
		ZoneModel.find({ "tournament": req.params.tournament_id }).exec( function(err, zones){
			var matchdays = [];
			if (err) throw err;
			for (var i = 0; i < zones.length; i++) {
				for (var j = zones[i].matchdays.length - 1; j >= 0; j--) {
					matchdays.push(zones[i].matchdays[j]._id)
				};
			};
			if (err) throw err;
			MatchModel.find({"matchday" : { $in : matchdays }, "played" : true }, {"mvp":1, "local_goals.player": 1, "visitor_goals.player": 1, "local_incidents.player": 1, "local_incidents.incident_type": 1, "visitor_incidents.player": 1,"visitor_incidents.incident_type": 1 }).exec(
				function (err, matches){
					if (err) throw err;
					var goals = [];
					var red_cards = [];
					var yellow_cards = [];
					var mvps = [];
					for (var i = 0; i < matches.length; i++) {
						var match = matches[i];
						mvps.push(match.mvp);
						for (var j = match.local_goals.length - 1; j >= 0; j--) {
							goals.push(match.local_goals[j].player)
						};
						for (var j = match.visitor_goals.length - 1; j >= 0; j--) {
							goals.push(match.visitor_goals[j].player)
						};
						for (var j = match.local_incidents.length - 1; j >= 0; j--) {
							var incident = match.local_incidents[j];
							if(incident.incident_type == "Amonestación"){
								yellow_cards.push(incident.player)
							}else if(incident.incident_type == "Expulsión"){
								red_cards.push(incident.player)
							}
						};

						for (var j = match.visitor_incidents.length - 1; j >= 0; j--) {
							var incident = match.visitor_incidents[j];
							if(incident.incident_type == "Amonestación"){
								yellow_cards.push(incident.player)
							}else if(incident.incident_type == "Expulsión"){
								red_cards.push(incident.player)
							}
						};
					};
					var hist = {};
					var goals_hist = {};
					goals.map( function (a) { if (a in goals_hist) goals_hist[a] ++; else goals_hist[a] = 1; } );
					var goals_hist_2 = groupByPlayer(goals);
					var yellow_cards_hist = {};
					yellow_cards.map( function (a) { if (a in yellow_cards_hist) yellow_cards_hist[a] ++; else yellow_cards_hist[a] = 1; } );
					var red_cards_hist = {};
					red_cards.map( function (a) { if (a in red_cards_hist) red_cards_hist[a] ++; else red_cards_hist[a] = 1; } );
					var mvps_hist = {};
					mvps.map( function (a) { if (a in mvps_hist) mvps_hist[a] ++; else mvps_hist[a] = 1; } );
					hist.goals = goals_hist;
					hist.top_scorers = goals_hist_2;
					hist.yellow_cards = yellow_cards_hist;
					hist.red_cards = red_cards_hist;
					hist.mvps = mvps_hist;
					res.send(hist);
				}
			);
		});
	});

	app.get('/api/matches/:id', function(req, res, next){
		MatchModel.findOne({ _id: req.params.id }).populate("visitor_team").populate("local_team").populate("local_suspensions").populate("visitor_suspensions").exec( function(err, match){
			if (err) throw err
			res.send(match)
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

	app.put('/api/matches/updateWalkOver/:id', function(req, res){
		var query = req.body.data
		MatchModel.update(
		    { _id: req.params.id}, 
		    {$set:  {"walk_over" : query.lost_for_both}}, callback)	
	});

	app.put('/api/matches/updateSetAsLostForBoth/:id', function(req, res){
		var query = req.body.data
		MatchModel.update(
		    { _id: req.params.id}, 
		    {$set: {"lost_for_both" : query.lost_for_both}}, callback)	
	});

	app.put('/api/matches/updateTurn/:id', function(req, res, next){
		TurnModel.findOne({ _id : req.body.turn_id}).populate('field', '_id name').exec( function(err, turn){
			MatchModel.findOne({ _id: req.params.id }).exec( function(err, match){
				if (err) throw err;
				if(match){
					match.turn = turn;
					//Hay que actualizar el horario del partido también.
					match.save(function(err){
						if (err) throw err;
						res.send(match);
					})
				}
			});
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
		
		if(req.params.team_role === "local"){
			var callback = function(err, numAffected, status){
				if(err) throw err;
				res.send(incident);
			}
			MatchModel.update(
			    { "_id": req.params.id}, 
			    {$push: {"local_incidents": incident}}, callback
			)
		}else{			
			if(req.params.team_role === "visitor"){
				var callback = function(err, numAffected, status){
					if(err) throw err;
					res.send(incident);
				}
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
				ZoneModel.find({ "tournament": req.params.tournament_id }).exec( function(err, zones){
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
			var callback = function(err, numAffected, status){
				if(err) throw err;
				res.send(true);
			}
			MatchModel.update(
			    { "local_incidents._id": id}, 
			    {$pull: {"local_incidents" :{_id : id }}}, callback)
		}else{
			if(req.params.team_role === "visitor"){
				team_role = "visitor_incidents";
				var callback = function(err, numAffected, status){
					if(err) throw err;
					res.send(true);
				}
				MatchModel.update(
				    { "visitor_incidents._id": id}, 
				    {$pull: {"visitor_incidents" :{_id : id }}}, callback)
			}			
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
