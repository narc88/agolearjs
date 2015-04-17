var ZoneModel = require('../models/zone').ZoneModel;
var TeamModel  = require('../models/team').TeamModel;
var ImageModel 	= require('../models/image').ImageModel;
var MatchdayModel = require('../models/matchday').MatchdayModel;
var PlayerModel = require('../models/player').PlayerModel;
var ParticipationModel = require('../models/participation').ParticipationModel;
var MatchModel = require('../models/match').MatchModel;
var mongoose = require('mongoose');
module.exports = function(app){


	// RESTful routes
	app.get('/api/zones', function(req, res, next){
		ZoneModel.find().exec( function(err, zones){
			if (err) throw err;
			res.send(zones);
		});
	});

	app.get('/api/zonesOfTournament', function(req, res, next){
		if(req.query.exclude){
			var excluded = [];
			excluded.push(req.query.exclude);
		}
		
		ZoneModel.find({"tournament" : req.query.tournament, "_id" : { $nin:excluded}}).exec( function(err, zones){
			if (err) throw err;
			console.log(zones.length)
			res.send(zones);
		});
	});

	app.get('/api/zones/:id', function(req, res, next){
		ZoneModel.findOne({ _id: req.params.id }).exec( function(err, zone){
			if (err) throw err;
			res.send(zone);
		});
	});

	app.post('/api/zones', function(req, res){
		var zone = new ZoneModel(req.body.zone);
		zone.save(function(err){
			if(err) throw err;
			req.send(zone);
		});
	});

	app.put('/api/zones/:id', function(req, res, next){
		ZoneModel.findOne({ _id: req.params.id }).exec( function(err, zone){
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
		ZoneModel.remove({ _id: req.params.id }).exec( function(err, zone){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes

	//Routes for embedded elements

	app.post('/api/zones/:id/participations', function(req, res){
		var callback = function(err, numAffected, status){
			if(err) throw err;
			req.send(true);
		}
		ZoneModel.update(
		    { _id: req.params.id}, 
		    {$push: {"participations": { $each: req.body.participations }}}, callback
		)
	});

	app.post('/api/zones/:id/participations/replace', function(req, res){
		//Reemplaza un equipo con otro entre los participantes
		var id = mongoose.Types.ObjectId(req.params.id);
		var replaced_id = mongoose.Types.ObjectId(req.body.data.team_id);
		var replacer = mongoose.Types.ObjectId(req.body.data.replacer_team);
		TeamModel.findOne({ _id: replacer }).exec( function(err, team){
			if (err) throw err;
			var participation = new ParticipationModel();
			participation.team = team._id;
			participation.team_name = team.name;

			ZoneModel.update(
			    { _id: id}, 
			    {$push: {"participations": participation}}, 
				    function(err, numAffected, status){
				    	console.log("push"+numAffected)
				    	 ZoneModel.update(
						    { _id: id}, 
						    {$pull: {"participations" :{ team :replaced_id}}}, function(err, numAffected, status){
						    	console.log("pull"+numAffected)
						    	ZoneModel.findOne({_id: id}).exec(function(err, zone){
									if(err) throw err;
									var matchdays = [];
									matchdays = zone.matchdays;
									MatchModel.update({"matchday" : {$in : matchdays}, "played": false, "local_team": replaced_id },{ $set : {"local_team" : replacer}},{upsert: false, multi: true}).exec(function(err, numAffected, status){
										console.log(numAffected);
										if(err) throw err;
										MatchModel.update({"matchday" : {$in : matchdays}, "played": false, "visitor_team": replaced_id },{ $set : {"visitor_team" : replacer}},{upsert: false, multi: true}).exec(function(err, numAffected, status){
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

	//Suspension for all players included on a team participation
	app.post('/api/zones/:id/participations/suspension', function(req, res, next){
		
	});

	app.delete('/api/zones/participations/:id', function(req, res, next){
		var callback = function(err, numAffected, status){
			if(err) throw err;
			req.send(goal);
		}
		ZoneModel.update(
		    { "participations._id": req.params.id}, 
		    {$pull: {"participations" :{_id : req.params.id }}}, callback
		)
	});

	//Create matchdays (tournament structure)
	app.post('/api/zones/:id/create_fixture', function(req, res){
		ZoneModel.findById(req.params.id).exec( function(err, zone){
			if (err) throw err;
			var participants = [];
			for (var i = zone.participants.length - 1; i >= 0; i--) {
			 	participants.push(zone.participants[i]._id);
			}; 
			var num_matches, num_matchdays;
		    if(participants.length%2 != 0){
		        num_matches = (participants.length-1)/2;
		    }else{
		        num_matches = (participants.length)/2;
		    }
		    if(zone.double_match){
		    	num_matchdays = (participants.length - 1)*2;
		    }else{
		    	num_matchdays = participants.length - 1;
		    }
	    	for (var j = num_matchdays; j > 0; j--) {
			    var matchday = new MatchdayModel();
			    matchday.number = number;
			    for (var i = 0; i < num_matches; i++) {
		            var match = new MatchModel();
		            match.visitor_team = participants[num_matchdays-i];
		            match.local_team = participants[i];
		            match.matchday = matchday._id
		            match.save(function(err){
		            	if(err) throw err;
		            });
			    	matchday.matches.push(match._id);
			    }
			    zone.matchdays.push(matchday);
	    		var moved_participant = participants.shift();
	    		participants.push(moved_participant);
	    	};
	    	if(zone.matchdays.length === num_matchdays){
	    		zone.save(function(err){
	    			if(err) throw err;
	    			res.send(zone);
	    		})
	    	}else{
	    		res.send("ERROR")
	    	}
		});
	});

	//Close zone
	app.get('/api/zones/:id/close', function(req, res, next){

		ZoneModel.findOne({ _id: req.params.id }).populate("tournament").exec( function(err, zone){
			if (err) throw err;
			//No deberia ser necesario volver a calcular si cada vez q guardamos un partido ya lo hacemos
			//for (var i = zone.participations.length - 1; i >= 0; i--) {
			//	update_participation(zone.participations[i]._id);
			//};
			close(zone);

		});
	});

	app.post('/api/zones/:matchday_id/update_participations', function(req, res, next){
		MatchModel.findOne({ "_id": req.body.match_id}, function (err, match){
			if (err) throw err;
			var id = mongoose.Types.ObjectId(req.params.matchday_id);
			ZoneModel.findOne({ "matchdays._id": id }).populate("tournament").exec( function(err, zone){
				if (err) throw err;
				update_participation(match.local_team, zone);
				update_participation(match.visitor_team, zone);
			});
		});
	});
	
	
	var update_participation = function(participant_id, zone){
		var matchdays = zone.matchdays;
		MatchModel.find({ "lost_for_both": false, "matchday" : {$in :  matchdays }, $or: [ {"visitor_team" : participant_id } , {"local_team" : participant_id }]}).exec( function(err, matches){
			if (err) throw err;
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
				if(matches[i].local_team.equals(participant_id)){
					own_goals += matches[i].local_goals.length;
					other_goals += matches[i].visitor_goals.length;
				}else if(matches[i].visitor_team.equals(participant_id)){
					other_goals += matches[i].local_goals.length;
					own_goals += matches[i].visitor_goals.length;
				}
			};
			points = zone.tournament.winner_points * won_matches + zone.tournament.tied_points * tied_matches + zone.tournament.presentation_points*(tied_matches+won_matches+lost_matches);  
			
			var callback = function(err, numAffected, status){
				if(err) throw err;

			}

			ZoneModel.update(
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


	var close_zone = function(zone){
		ZoneModel.aggregate(
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

					ZoneModel.update({ "participations.team": zone.participations[i]._id }, { $set: { "participations.$.position" : pos, "closed":true}}, callback)
				};
			});
	}

	app.post('/api/zones/:zone_id/participation/:team_id/players', function(req, res, next){
		var selected_players = req.body.players;
		PlayerModel.find({_id :{ $in : selected_players}}).populate('players', 'name last_name dni').exec( function(err, players){
			if (err) throw err;
			ZoneModel.update(
			    { _id: req.params.zone_id, 'participations.team' : req.params.team_id}, 
			    {$push: {"participations.$.players": players}}, 
				    function(err, numAffected, status){
				    	res.send(players);
				    });
			
		});
	});


	
}

