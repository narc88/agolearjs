var Models = require('../model_factory');
var DataGrouper = require('../helpers/dataGrouper').DataGrouper;
var mongoose = require('mongoose');

module.exports = function(app){

	// RESTful routes
	app.get('/api/matches', function(req, res, next){
		var models = Models(req.tenant);
		console.log(req.query)
		models.match.find(req.query).populate("visitor_team").populate("local_team").exec( function(err, matches){
			if (err) throw err;
			res.send(matches);
		});
	});

	//Crear un nuevo partido, amistoso, quizá?
	app.post('/api/matches', function(req, res, next){
		var models = Models(req.tenant);
		models.match.findOne({ '_id': req.body._id }).exec( function(err, match){
			if (err) throw err;
			res.send(match);
		});
	});

	app.get('/api/matchesLastPlayed', function(req, res, next){
		var models = Models(req.tenant);
		var team_id = req.query.team
		models.match.find({$or: [{'local_team': team_id}, {'visitor_team' : team_id}]}).sort({'start_datetime': -1}).limit(5).exec( function(err, matches){
			if (err) throw err;
			res.send(matches);
		});
	});

	app.get('/api/matches/mvp/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.match.find({'mvp' : req.params.id}).sort({'start_datetime': -1}).exec( function(err, matches){
			if (err) throw err;
			res.send(matches);
		});
	});

	app.post('/sapi/matches/mvp/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.match.find({'_id':req.params.id}).exec( function(err, match){
			if (err) throw err;
			var callback = function(err, numAffected, status){
				if(err) throw err;
				res.send(req.body.player_id);
			}
			models.match.update(
			    { _id: req.params.id}, 
			    {$set:  {"mvp" : req.body.player_id}}, callback)	
		});
	});

	app.get('/api/participators_stats/:tournament_id', function(req, res, next){
		var models = Models(req.tenant);
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
		models.zone.find({ "tournament": req.params.tournament_id }).exec( function(err, zones){
			var matchdays = [];
			if (err) throw err;
			for (var i = 0; i < zones.length; i++) {
				for (var j = zones[i].matchdays.length - 1; j >= 0; j--) {
					matchdays.push(zones[i].matchdays[j]._id)
				};
			};
			if (err) throw err;
			models.match.find({"matchday" : { $in : matchdays }, "played" : true }, {"mvp":1, "local_goals.player": 1, "visitor_goals.player": 1, "local_incidents.player": 1, "local_incidents.incident_type": 1, "visitor_incidents.player": 1,"visitor_incidents.incident_type": 1 }).exec(
				function (err, matches){
					if (err) throw err;
					var goals = [];
					var red_cards = [];
					var yellow_cards = [];
					var double_yellow_cards = [];
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
							}else if(incident.incident_type == "Doble Amonestación"){
								double_yellow_cards.push(incident.player);
							}
						};

						for (var j = match.visitor_incidents.length - 1; j >= 0; j--) {
							var incident = match.visitor_incidents[j];
							if(incident.incident_type == "Amonestación"){
								yellow_cards.push(incident.player)
							}else if(incident.incident_type == "Expulsión"){
								red_cards.push(incident.player)
							}else if(incident.incident_type == "Doble Amonestación"){
								double_yellow_cards.push(incident.player);
							}
						};
					};
					var hist = {};
					var goals_hist = {};
					goals.map( function (a) { if (a in goals_hist) goals_hist[a] ++; else goals_hist[a] = 1; } );
					var goals_hist_2 = groupByPlayer(goals);
					var yellow_cards_hist = {};
					yellow_cards.map( function (a) { if (a in yellow_cards_hist) yellow_cards_hist[a] ++; else yellow_cards_hist[a] = 1; } );
					var double_yellow_cards_hist = {};
					double_yellow_cards.map( function (a) { if (a in double_yellow_cards_hist) double_yellow_cards_hist[a] ++; else double_yellow_cards_hist[a] = 1; } );
					var red_cards_hist = {};
					red_cards.map( function (a) { if (a in red_cards_hist) red_cards_hist[a] ++; else red_cards_hist[a] = 1; } );
					var mvps_hist = {};
					mvps.map( function (a) { if (a in mvps_hist) mvps_hist[a] ++; else mvps_hist[a] = 1; } );
					hist.goals = goals_hist;
					hist.top_scorers = goals_hist_2;
					hist.yellow_cards = yellow_cards_hist;

					hist.double_yellow_cards = double_yellow_cards_hist;
					hist.red_cards = red_cards_hist;
					hist.mvps = mvps_hist;
					res.send(hist);
				}
			);
		});
	});

	app.get('/api/matches/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.match.findOne({ _id: req.params.id }).populate("visitor_team").populate("local_team").populate("local_suspensions").populate("visitor_suspensions").exec( function(err, match){
			if (err) throw err;
			res.send(match)
		});
	});

	app.post('/sapi/matches/setMatchAsPlayed', function(req, res){
		var models = Models(req.tenant);
		models.match.findOne({ _id: req.body.match_id }).exec(function(err, match){
			if(match){
				var players = match.visitor_players.concat(match.local_players);
				models.suspension.find({ "accomplished": false , 'player' : { $in : players } }).exec(function(err, suspensions){
					if(err) throw err;
					var players_suspensions = [];
					for (var i = suspensions.length - 1; i >= 0; i--) {
						if(players_suspensions.indexOf(suspensions[i].player)<0){
							if(suspensions[i].matches.indexOf(match._id) < 0){
								suspensions[i].matches.push(match._id);
								console.log(suspensions[i].player + 'Acumula nuevo partido a su suspension')
								if(suspensions[i].matches.length >= suspensions[i].number_of_matches){
									suspensions[i].accomplished = true;
								}
								players_suspensions.push(suspensions[i].player)
								suspensions[i].save(function(err){
									if(err) throw err;
									console.log('Suspension updated for player ')
								});
							}
						}
					};
					match.played = true;
					match.save(function(err){
						if(err) throw err;
						models.match.findOne({$or :[{ 'visitor_son': match._id },{ 'local_son': match._id}]}).exec( function(err, playoff_match){
							if (err) throw err;
							if(!playoff_match){
								res.send(match)
							}else{
								var winner_id = '';
								var winner_name = '';

								if(match.winner){
									if( match.winner.equals(match.visitor_team)){
										winner_id = match.visitor_team;
										winner_name = match.visitor_team_name;
									}else if(match.winner.equals(match.local_team)){
										winner_id = match.local_team;
										winner_name = match.local_team_name;
									}
									
									if( playoff_match.visitor_son.equals(match._id)){
										playoff_match.visitor_team = winner_id;
										playoff_match.visitor_team_name = winner_name;
									}
									if( playoff_match.local_son.equals(match._id)){
										playoff_match.local_team = winner_id;
										playoff_match.local_team_name = winner_name;
									}

								}
								playoff_match.save(function(err){
									if(err) throw err;
									res.send(match)
								});
							}
							
						});
					});
				});
				
			}
			
		})
		
	});

	app.put('/sapi/matches/updateWalkOver/:id', function(req, res){
		var models = Models(req.tenant);
		var callback = function(err, numAffected, status){
			if(err) throw err;
			res.send(true);
		}
		var query = req.body.data
		models.match.update(
		    { _id: req.params.id}, 
		    {$set:  {"walk_over" : query.walk_over}}, callback)	
	});

	app.put('/sapi/matches/updateSetAsLostForBoth/:id', function(req, res){
		var models = Models(req.tenant);
		var callback = function(err, numAffected, status){
			if(err) throw err;
			res.send(true);
		}
		var query = req.body.data
		models.match.update(
		    { _id: req.params.id}, 
		    {$set: {"lost_for_both" : query.lost_for_both}}, callback)	
	});

	app.put('/sapi/matches/updateTurn/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.turn.findOne({ _id : req.body.turn_id}).populate('field', '_id name').exec( function(err, turn){
			models.match.findOne({ _id: req.params.id }).exec( function(err, match){
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

	app.put('/sapi/matches/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.match.findOne({ _id: req.params.id }).exec( function(err, match){
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

	app.delete('/sapi/matches/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.match.remove({ _id: req.params.id }).exec( function(err, match){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes

	//Routes for embedded elements
	app.post('/sapi/matches/goals/:team_role/:id', function(req, res){
		var models = Models(req.tenant);
		var team_role = ""
		var goal = new models.goal(req.body);		
		models.match.findOne({ "_id": req.params.id}).exec(function (err, match){
		 	if(req.params.team_role === "local"){
		 		if(goal.own_goal){
		 			match.visitor_goals.push(goal);
		 		}else{
		 			match.local_goals.push(goal);
		 		}
			}else{			
				if(req.params.team_role === "visitor"){
					if(goal.own_goal){
			 			match.local_goals.push(goal);
			 		}else{
			 			match.visitor_goals.push(goal);
			 		}
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
				var callback = function(err, numAffected, status){
					if(err) throw err;
					res.send(match);
				}
				if(goal.own_goal){
					res.send(match);
				}else{
					models.player.update({'_id': goal.player}, {$push: { 'goals' : goal}}, callback)
				}
			})
		
		});
		
	});

	app.delete('/sapi/matches/goals/:team_role/:id', function(req, res, next){
		var models = Models(req.tenant);
		var team_role = ""
		var id = mongoose.Types.ObjectId(req.params.id);
		if(req.params.team_role === "local"){
			team_role = "local_goals";
			var callback = function(err, numAffected, status){
					if(err) throw err;
					var callback2 = function(err, numAffected, status){
						if(err) throw err;
						res.send(true)
					}
					models.player.update({'goals._id': id}, {$pull: { 'goals' :{_id : id }}}, callback2);
				}
			models.match.update(
			    { "local_goals._id": id}, 
			    {$pull: {"local_goals" :{_id : id }}}, callback
			)
		}else{
			if(req.params.team_role === "visitor"){
				team_role = "visitor_goals";
				var callback = function(err, numAffected, status){
					if(err) throw err;
					var callback2 = function(err, numAffected, status){
						if(err) throw err;
						res.send(true)
					}
					models.player.update({'goals._id': id}, {$pull: { 'goals'  :{_id : id }}}, callback2);
				}
				models.match.update(
				    { "visitor_goals._id": id}, 
				    {$pull: {"visitor_goals" :{_id : id }}}, callback
				)
			}			
		}
		
	});

	app.post('/sapi/matches/incidents/:team_role/:id/:matchday_id', function(req, res){
		var models = Models(req.tenant);
		var team_role = ""
		var incident = new models.incident(req.body);
		var id = mongoose.Types.ObjectId(req.params.id);
		models.match.findOne({ "_id": req.params.id}).exec(function(err, match){
			if (err) throw err;
			models.zone.findOne({"matchdays._id": req.params.matchday_id}).exec( function(err, zone){
				if (err) throw err;
				incident.tournament = zone.tournament;
				if(req.params.team_role === "local"){
					match.local_incidents.push(incident);
				}else{			
					if(req.params.team_role === "visitor"){
						match.visitor_incidents.push(incident);
					}
				}
				var callback = function(err, numAffected, status){
					if(err) throw err;
					console.log(numAffected)
				}
				models.player.update({'_id': incident.player}, {$push: { 'incidents' : incident}}, callback);
				models.tournament.findOne({"_id": zone.tournament}).exec( function(err, tournament){
					if (err) throw err;
					models.player.findOne({"_id" : incident.player}).exec( function(err, player){
						if (err) throw err;
						var yellow_card = 0;
						var red_card = 0;
						console.log(player)
						var tournament_id = mongoose.Types.ObjectId(zone.tournament);
						for (var i = 0; i < player.incidents.length; i++) {
							var tournament_in_array = mongoose.Types.ObjectId(player.incidents[i].tournament);
							if(tournament_id.equals(tournament_in_array)){
								if(player.incidents[i].incident_type == "Amonestación"){
									yellow_card++;
								}
								if((player.incidents[i].incident_type == "Expulsión") || (player.incidents[i].incident_type == "Doble Amonestación")){
									red_card++;
								}
							}
						};
						console.log("Tarjetas amarillas en el torneo" + yellow_card)
						if(((yellow_card > 0) && (yellow_card % tournament.yellow_card_limit) === 0 )|| ((incident.incident_type == "Expulsión") || (incident.incident_type == "Doble Amonestación")) ){
							var suspension = new models.suspension();
							suspension.player = incident.player;
							suspension.match = match._id;
							suspension.reason = incident.incident_type;
							suspension.number_of_matches = 1;
							if(req.params.team_role === "local"){
								match.local_suspensions.push(suspension._id);
							}else{			
								if(req.params.team_role === "visitor"){
									match.visitor_suspensions.push(suspension._id);
								}
							}
							match.save(function(err){
								if (err) throw err;
								suspension.save(function(err){
									if(err) throw err;
									res.send({'match':match, 'suspension' : suspension});
								});
							});
						}else{
							match.save(function(err){
								if (err) throw err;
								res.send({'match':match});
							});
						}
					});
				});
			});
		})		
	});

	app.delete('/sapi/matches/incidents/:team_role/:id', function(req, res, next){
		var models = Models(req.tenant);
		var team_role = ""
		var id = mongoose.Types.ObjectId(req.params.id);
		if(req.params.team_role === "local"){
			team_role = "local_incidents";
			var callback = function(err, numAffected, status){
				if(err) throw err;
				var callback2 = function(err, numAffected, status){
					if(err) throw err;
					res.send(true)
				}
				models.player.update({'incidents._id': id}, {$pull: { 'incidents'  :{_id : id }}}, callback2);
			}
			models.match.update(
			    { "local_incidents._id": id}, 
			    {$pull: {"local_incidents" :{_id : id }}}, callback)
		}else{
			if(req.params.team_role === "visitor"){
				team_role = "visitor_incidents";
				var callback = function(err, numAffected, status){
					if(err) throw err;
					var callback2 = function(err, numAffected, status){
						if(err) throw err;
						res.send(true)
					}
					models.player.update({'incidents._id': id}, {$pull: { 'incidents' :{_id : id }}}, callback2);
				}
				models.match.update(
				    { "visitor_incidents._id": id}, 
				    {$pull: {"visitor_incidents" :{_id : id }}}, callback)
			}			
		}
		
		
		
	});

	app.post('/sapi/matches/:team_role/:id/players', function(req, res){
		var models = Models(req.tenant);
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
		models.match.update(
		    { _id: req.params.id}, 
		    {$push: {$each:{team_role: req.body.players}}}, callback)
	});

	app.delete('/sapi/matches/:team_role/:id/players/:player_id', function(req, res, next){
		var models = Models(req.tenant);
		if(req.params.team_role === "local"){
			var callback = function(err, numAffected, status){
				if(err) throw err;
				console.log(numAffected)
				res.send(req.params.player_id);
			}
			models.match.update(
			    { "_id": req.params.id}, 
			    {$pull: {'local_players' :{ _id : req.params.player_id }}}, callback
			)
		}else{			
			if(req.params.team_role === "visitor"){
				var callback = function(err, numAffected, status){
					if(err) throw err;
					console.log(numAffected)
					res.send(req.params.player_id);
				}
				models.match.update(
			    { "_id": req.params.id}, 
			    {$pull: {'visitor_players' :{ _id : req.params.player_id }}}, callback
			)
			}
		}
		
	});

	app.post('/sapi/matches/addPlayers', function(req, res){
		//{"team_id" : team_id,"match_id" : match_id,"matchday_id" : matchday_id,"role" : role}
		console.log(req.body)
		var models = Models(req.tenant);
		
		models.zone.findOne({'matchdays._id': req.body.matchday_id}).exec( function(err, playoff_zone){
			if(err) throw err;
			console.log(playoff_zone)
			console.log('tournament'+playoff_zone.tournament)
			models.zone.findOne({'tournament' :playoff_zone.tournament, 'participations.team': req.body.team_id}).exec( function(err, zone){
				if(err) throw err;
				console.log(zone)
				var team_id = mongoose.Types.ObjectId(req.body.team_id);
				var players = [];
				for (var i = 0; i < zone.participations.length; i++) {
					console.log(team_id)
					console.log(zone.participations[i].team)
					if(zone.participations[i].team == req.body.team_id){
						players = zone.participations[i].players;
						console.log(players)
					}
				};
				var callback = function(err, numAffected, status){
					if(err) throw err;
					console.log(numAffected)
					res.send(players);
				}

				if(req.body.role === "local"){
					models.match.update(
				    { _id: req.body.match_id}, 
				    {$addToSet: {'local_players':{$each: players}}}, callback)
				}else{
					if(req.body.role === "visitor"){
						models.match.update(
					    { _id: req.body.match_id}, 
					    {$addToSet: {'visitor_players':{$each: players}}}, callback)
					}			
				}
					
			});
		});
	});
}
