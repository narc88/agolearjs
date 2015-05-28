var Models = require('../model_factory');
var mongoose = require('mongoose');
module.exports = function(app){


	// RESTful routes
	app.get('/api/zones', function(req, res, next){
		var models = Models(req.tenant);
		models.zone.find().exec( function(err, zones){
			if (err) throw err;
			res.send(zones);
		});
	});

	app.get('/api/getZones', function(req, res, next){
		var models = Models(req.tenant);
		var excluded = [];
		if(req.query.exclude){
			excluded.push(req.query.exclude);
		}
		var queryArray = req.query._id.split(',');
		models.zone.find({_id :{ $in : queryArray, $nin: excluded}}).exec( function(err, zones){
			if (err) throw err;
			console.log(zones)
			res.send(zones);
		});
	});

	app.get('/api/zonesTournament', function(req, res, next){
		var models = Models(req.tenant);
		var excluded = [];
		if(req.query.exclude){
			excluded.push(req.query.exclude);
		}
		models.zone.find({'tournament': req.query.tournament ,_id :{$nin: excluded}}).exec( function(err, zones){
			if (err) throw err;
			console.log(zones.length)
			res.send(zones);
		});
	});


	app.get('/api/zones/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.zone.findOne({ _id: req.params.id }).exec( function(err, zone){
			if (err) throw err;
			res.send(zone);
		});
	});

	app.post('/api/zones', function(req, res){
		var models = Models(req.tenant);
		var zone = new models.zone(req.body.zone);
		zone.save(function(err){
			if(err) throw err;
			req.send(zone);
		});
	});

	app.put('/api/zones/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.zone.findOne({ _id: req.params.id }).exec( function(err, zone){
			if (err) throw err;
			if(zone){
				zone.name = req.body.zone.name;
				zone.modified = new Date();
				zone.save(function(err){
					if (err) throw err;
					res.send(zone);
				});
			}
		});
	});

	app.delete('/api/zones/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.zone.remove({ _id: req.params.id }).exec( function(err, zone){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes

	//Routes for embedded elements

	app.post('/api/zones/:id/participations', function(req, res){
		var models = Models(req.tenant);
		var callback = function(err, numAffected, status){
			if(err) throw err;
			req.send(true);
		}
		models.zone.update(
		    { _id: req.params.id}, 
		    {$push: {"participations": { $each: req.body.participations }}}, callback
		)
	});

	app.post('/api/zones/:id/participations/replace', function(req, res){
		var models = Models(req.tenant);
		//Reemplaza un equipo con otro entre los participantes
		var id = mongoose.Types.ObjectId(req.params.id);
		var replaced_id = mongoose.Types.ObjectId(req.body.data.team_id);
		var replacer = mongoose.Types.ObjectId(req.body.data.replacer_team);
		models.team.findOne({ _id: replacer }).exec( function(err, team){
			if (err) throw err;
			var participation = new ParticipationModel();
			participation.team = team._id;
			participation.team_name = team.name;

			models.zone.update(
			    { _id: id}, 
			    {$push: {"participations": participation}}, 
				    function(err, numAffected, status){
				    	console.log("push"+numAffected)
				    	 models.zone.update(
						    { _id: id}, 
						    {$pull: {"participations" :{ team :replaced_id}}}, function(err, numAffected, status){
						    	console.log("pull"+numAffected)
						    	models.zone.findOne({_id: id}).exec(function(err, zone){
									if(err) throw err;
									var matchdays = [];
									matchdays = zone.matchdays;
									models.match.update({"matchday" : {$in : matchdays}, "played": false, "local_team": replaced_id },{ $set : {"local_team" : replacer}},{upsert: false, multi: true}).exec(function(err, numAffected, status){
										console.log(numAffected);
										if(err) throw err;
										models.match.update({"matchday" : {$in : matchdays}, "played": false, "visitor_team": replaced_id },{ $set : {"visitor_team" : replacer}},{upsert: false, multi: true}).exec(function(err, numAffected, status){
											console.log(numAffected);
											if(err) throw err;
											res.send(participation);
										});
									});
								});
						    }
						)
				    }
			);
			
		});
	});

	app.post('/api/zones/matchdays/dispute_day',function(req, res, next){
		var models = Models(req.tenant);
		var callback = function(err, numAffected, status){
			if(err) throw err;
			req.body.data.dispute_day = new Date(req.body.data.dispute_day).toISOString();
			res.send(req.body.data);
		}
		models.zone.update(
		    { "matchdays._id": req.body.data.matchdayId}, 
		    {$set: {"matchdays.$.dispute_day" : req.body.data.dispute_day}}, callback
		)
	});

	//Suspension for all players included on a team participation
	app.post('/api/zones/:id/participations/suspension', function(req, res, next){
		var models = Models(req.tenant);
	});

	app.delete('/api/zones/participations/:id', function(req, res, next){
		var models = Models(req.tenant);
		var callback = function(err, numAffected, status){
			if(err) throw err;
			res.send(goal);
		}
		models.zone.update(
		    { "participations._id": req.params.id}, 
		    {$pull: {"participations" :{_id : req.params.id }}}, callback
		)
	});

	//Create matchdays (tournament structure)
	app.post('/api/zones/:id/create_league_fixture', function(req, res){
		var models = Models(req.tenant);
		models.tournament.findById(req.body.tournament_id).exec( function(err, tournament){
			models.zone.findById(req.params.id).exec( function(err, zone){
				if (err) throw err;
				if(zone.matchdays.length > 0){
					res.send({'error':'Esta zona ya tiene fixture'})
				}else{
					var participations = zone.participations;
					var num_matches, num_matchdays;
				    if(participations.length%2 != 0){
				        num_matches = (participations.length-1)/2;
				    }else{
				        num_matches = (participations.length)/2;
				    }
				    if(tournament.double_league_match){
				    	num_matchdays = (participations.length - 1)*2;
				    }else{
				    	num_matchdays = participations.length - 1;
				    }
				    for (var j = 0; j < num_matchdays; j++) {
					    var matchday = new MatchdayModel();
					    matchday.matchday_number = j+1;
					    var today = new Date();
					   	matchday.dispute_day =  today.setDate(today.getDate()+(7*(j+1)));
					    for (var i = 0; i < num_matches; i++) {
				            var match = new MatchModel();
				            match.visitor_team = participations[num_matchdays-i].team;
				            match.local_team = participations[i].team;
				            match.local_team_name = participations[i].team_name;
				            match.visitor_team_name = participations[num_matchdays-i].team_name;
				            match.matchday = matchday._id
				            match.save(function(err){
				            	if(err) throw err;
				            	console.log("match")
				            	console.log(match)
				            });
					    	matchday.matches.push(match._id);
					    	
					    }
					    zone.matchdays.push(matchday);
			    		var moved_participant = participations.shift();
			    		participations.push(moved_participant);
			    	};
		    		zone.save(function(err){
		    			if(err) throw err;
		    			res.send(zone);
		    		})
		    	}
			});
		});
	});

	app.get('/api/zones/:tournament_id/classified', function(req, res){
		var models = Models(req.tenant);
		models.tournament.findById(req.params.tournament_id).exec( function(err, tournament){
			models.zone.aggregate(
					{ $match: { "_id": { $in : tournament.zones }}},
					{ $unwind : "$participations" },
					function (err, participators){
						if (err) throw err;
						console.log(participators)
						res.send({'tournament':tournament , 'participators':participators})
					});
		});
	});
	//Create playoff fixture
	app.post('/api/zones/:id/create_playoff_fixture', function(req, res){
		
		//Lista de id de equpos clasificados.
		//req.body.classiffied_teams

		var models = Models(req.tenant);
		var classiffied_teams = req.body.classified;
		console.log(classiffied_teams)
		
			models.tournament.findById(req.body.tournament_id).exec( function(err, tournament){
				models.zone.findOne({'tournament':req.body.tournament_id, 'zone_type': 'Playoff'}).exec( function(err, zone){
					if (err) throw err;
					if(zone.matchdays.length > 0){
						res.send({'error':'Esta zona ya tiene fixture'})
					}else{
						var match_list = [];
						var participations = classiffied_teams;
						var num_matches, num_matchdays;
					    if(participations.length%2 != 0){
					        num_matches = (participations.length+1)/2;
					    }else{
					        num_matches = (participations.length)/2;
					    }
					    var round_number = 0;
					    round_number++;
					    var matchday = new models.matchday();
					    var round = (participations.length / 2 )+ 'De final';
					    if(participations.length == 32){
					    	round = '16vos de final';
					    }else if(participations.length == 16){
					    	round = '8vos de final';
					    }else if(participations.length == 8){
					    	round = '4tos de final';
					    }else if(participations.length == 4){
					    	round = 'Semi Final';
					    }else if(participations.length == 2){
					    	round = 'Final';
					    }
					    matchday.matchday_number = round_number;
					    matchday.matchday_name = round;
					    var today = new Date();
					   	matchday.dispute_day =  today.setDate(today.getDate()+(7*(round_number+1)));
					    for (var i = 0; i < num_matches; i++) {
				            var match = new models.match();

				            match.visitor_team = participations[participations.length-i-1].team_id;
				            match.local_team = participations[i].team_id;
				            match.local_team_name = participations[i].team_name;
				            match.visitor_team_name = participations[participations.length-i-1].team_name;
				            match.matchday = matchday._id
				            match_list.push(match._id)

				            match.save(function(err){
				            	if(err) throw err;

				            	console.log("match")
				            	console.log(match)
				            });
					    	matchday.matches.push(match._id);
					    	
					    }
					    zone.matchdays.push(matchday);

					    while(num_matches > 1) {
					    	if(num_matches%2 != 0){
						        num_matches = (num_matches+1)/2;
						    }else{
						        num_matches = (num_matches)/2;
						    }
						    round_number++;
						    var matchday = new models.matchday();
						    var round = (num_matches / 2 )+ 'De final';
						    if(num_matches == 16){
						    	round = '16vos de final';
						    }else if(num_matches == 8){
						    	round = '8vos de final';
						    }else if(num_matches == 4){
						    	round = '4tos de final';
						    }else if(num_matches == 2){
						    	round = 'Semi Final';
						    }else if(num_matches == 1){
						    	round = 'Final';
						    }
						    matchday.matchday_number = round_number;
						    matchday.matchday_name = round;
						    var today = new Date();
						   	matchday.dispute_day =  today.setDate(today.getDate()+(7*(round_number+1)));
						   	var new_match_list = [];
						    for (var i = 0; i < num_matches; i++) {
					            var match = new models.match();
					            if( match_list[i*2]){
					            	match.visitor_son = match_list[i*2];
					            }
					            if( match_list[(i*2) +1 ]){
					            	match.local_son = match_list[(i*2) +1 ];
					            }
					            new_match_list.push(match._id);
					            match.matchday = matchday._id
					            match.save(function(err){
					            	if(err) throw err;
					            	console.log("match")
					            });
						    	matchday.matches.push(match._id);
						    	
						    }
						    console.log(match_list);
						    match_list = new_match_list;
						    zone.matchdays.push(matchday);
						    
				    	};
			    		zone.save(function(err){
			    			if(err) throw err;
			    			console.log('zone saved')
			    			res.send(zone);
			    		})
			    	}
				});
			});
		
	});

	app.post('/api/zones/addTurns/:id', function(req, res){
		var models = Models(req.tenant);
		function shuffle(array) {
		  var currentIndex = array.length, temporaryValue, randomIndex ;
		  while (0 !== currentIndex) {
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		  }

		  return array;
		}

		models.turn.find({_id : {$in: req.body.turns}}).populate('field').exec( function(err, turns){
			if (err) throw err;
			models.zone.findOne({ _id: req.params.id }).exec( function(err, zone){
				if (err) throw err;
				console.log("fechas"+zone.matchdays.length)
				for (var i = 0; i < zone.matchdays.length; i++) {
					var matchday = zone.matchdays[i]._id
					models.match.find({ 'matchday' : matchday}).exec( function(err, matches){
						if (err) throw err;
						var matchday_turns = shuffle(turns);
						console.log('partids' +matches.length)
						console.log('turns' +matches.length)
						for (var i = 0; i < turns.length; i++) {
							matches[i].turn = [];
							matches[i].turn.push(matchday_turns[i]);
							matches[i].save(function(err){
								if (err) throw err;
							})
						};
						setTimeout(function(){ res.send(true) }, 150);
					});
				};
			});
		});
	});

	//Close zone
	app.get('/api/zones/:id/close', function(req, res, next){
		var models = Models(req.tenant);
		models.zone.findOne({ _id: req.params.id }).populate("tournament").exec( function(err, zone){
			if (err) throw err;
			//No deberia ser necesario volver a calcular si cada vez q guardamos un partido ya lo hacemos
			//for (var i = zone.participations.length - 1; i >= 0; i--) {
			//	update_participation(zone.participations[i]._id);
			//};
			close(zone);

		});
	});

	var update_participation = function(participant_id, zone, models){
		var matchdays = zone.matchdays;
		console.log(matchdays.length)
		console.log('Participant'+participant_id)
		models.match.find({ "lost_for_both": false, "matchday" : {$in :  matchdays }, $or: [ {"visitor_team" : participant_id } , {"local_team" : participant_id }]}).exec( function(err, matches){
			if (err) throw err;
			console.log(matches.length)
			var points = 0;
			var won_matches = 0;
			var tied_matches = 0;
			var lost_matches = 0;
			var own_goals = 0;
			var other_goals = 0;
			var points = 0;
			for (var i = matches.length - 1; i >= 0; i--) {
				if(!matches[i].winner){
					tied_matches++;
				}else if(matches[i].winner.equals(participant_id)){
					won_matches++;
				}else{
					lost_matches++;
				}
				console.log(tied_matches+'Empatados-'+won_matches+'Ganados-'+lost_matches+'Perdidos')
				if(matches[i].local_team.equals(participant_id)){
					own_goals += matches[i].local_goals.length;
					other_goals += matches[i].visitor_goals.length;
				}else if(matches[i].visitor_team.equals(participant_id)){
					other_goals += matches[i].local_goals.length;
					own_goals += matches[i].visitor_goals.length;
				}
			};
			points = zone.tournament.winner_points * won_matches + zone.tournament.tied_points * tied_matches + zone.tournament.presentation_points*(tied_matches+won_matches+lost_matches);  
			console.log('Puntos'+points)
			var callback = function(err, numAffected, status){
				if(err) throw err;
				console.log('Participacion Actualizada')
			}

			models.zone.update(
			    { "participations.team": participant_id}, 
			    {
			    	$set: {
			    		"participations.$.won" : won_matches,
			    		"participations.$.lost" : lost_matches,
			    		"participations.$.tied" : tied_matches,
			    		"participations.$.points" : points,
			    		"participations.$.own_goals" : own_goals,
			    		"participations.$.other_goals" : other_goals
						}
					}, callback);
		});
	}


	app.post('/api/zones/:matchday_id/update_participations', function(req, res, next){
		var models = Models(req.tenant);
		models.match.findOne({ "_id": req.body.match_id}, function (err, match){
			if (err) throw err;
			var id = mongoose.Types.ObjectId(req.params.matchday_id);
			models.zone.findOne({ "matchdays._id": id }).populate("tournament").exec( function(err, zone){
				if (err) throw err;
				update_participation(match.local_team, zone, models);
				update_participation(match.visitor_team, zone, models);
			});
		});
	});
	
	


	var close_zone = function(zone){
		models.zone.aggregate(
			{ $match: { "_id": zone._id }},
			{ $unwind : "$participations" },
			{ $project: { goalDiff : { $subtract: ["own_goals", "other_goals"]}}},
			{ $sort : { "points" : -1, "own_goals" : -1, "other_goals" : 1, "goalDiff" : -1 , "won" : -1}},
			function (err, participators){
				if (err) throw err;
				var callback = function(err, numAffected, status){
					if(err) throw err;
				}
				for (var i = 0; i < zone.participations.length; i++) {
					pos = i+1;

					models.zone.update({ "participations.team": zone.participations[i]._id }, { $set: { "participations.$.position" : pos, "closed":true}}, callback)
				};
			});
	}

	app.post('/api/zones/:zone_id/participation/:team_id/players', function(req, res, next){
		var models = Models(req.tenant);
		var selected_players = req.body.players;
		models.player.find({_id :{ $in : selected_players}}, 'name last_name dni').exec( function(err, players){
			if (err) throw err;
			models.zone.update(
			    { _id: req.params.zone_id, 'participations.team' : req.params.team_id}, 
			    {$push: {"participations.$.players": { $each : players }}}, 
				    function(err, numAffected, status){
				    	res.send(players);
				    });
			
		});
	});


	
}

