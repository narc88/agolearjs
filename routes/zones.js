var ZoneModel = require('../models/zone').ZoneModel;
var ImageModel 	= require('../models/image').ImageModel;
var MatchdayModel = require('../models/matchday').MatchdayModel;
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
		
		TeamModel.findOne({ _id: req.body.new_team_id }).exec( function(err, team){
			if (err) throw err;
			var participation = new ParticipationModel();
			participation.team_id = team._id;
			participation.name = team.name;

			var callback = function(err, numAffected, status){
				if(err) throw err;
				req.send(goal);
			}
			ZoneModel.update(
			    { _id: req.params.id}, 
			    {$push: {"participations": participation}}, 
				    function(err, numAffected, status){
				    	 ZoneModel.update(
						    { "participations._id": req.params.id}, 
						    {$pull: {"participations" :{_id : req.params.id}}}, callback
						)
				    }
			);
		});
		
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
	
	var update_participation = function(participant_id){
		MatchModel.find({ "matchday" : {$in : { zone.matchdays }}, $or: [ {"visitor_team" : participant_id } , {"local_team" : participant_id }]}).exec( function(err, matches){
			if (err) throw err;
			var points = 0;
			var won_matches = 0;
			var tied_matches = 0;
			var lost_matches = 0;
			var own_goals = 0;
			var other_goals = 0;
			var points = 0;
			for (var i = matches.length - 1; i >= 0; i--) {
				if(matches[i].winner === participant_id){
					won_matches++;
				}else if((matches[i].winner !== matches[i].local_team)&&(matches[i].winner !== matches[i].visitor_team)){
					tied_matches++;
				}else{
					lost_matches++;
				}
				if(matches[i].local_team === participant_id){
					own_goals += matches[i].local_team_goals.length;
					other_goals += matches[i].visitor_team_goals.length;
				}else if(matches[i].visitor_team === participant_id){
					other_goals += matches[i].local_team_goals.length;
					own_goals += matches[i].visitor_team_goals.length;
				}
			};
			points = zone.tournament.winner_points * won_points + zone.tournament.tied_points * tied_matches + zone.tournament.presentation_points*(tied_matches+won_matches+lost_matches);  

			var callback = function(err, numAffected, status){
				if(err) throw err;
			}

			ZoneModel.update(
			    { "participations.team": participant_id}, 
			    {
			    	$set: {
			    		"won" : won_matches,
			    		"lost" : lost_matches,
			    		"tied" : tied_matches,
			    		"points" : points,
			    		"own_goals" : own_goals,
			    		"other_goals" : other_goals
						}
					}, callback);
		});
	}

	var close_zone = function(){
		ZoneModel.aggregate(
			{ $match: { "_id": zone._id }},
			{ $unwind : "$participations" },
			{ $project: { goalDiff : { $subtract: ["own_goals", "other_goals"]}}},
			{ $sort : { "points" : -1, "own_goals" : -1, "other_goals" : 1, "goalDiff" : -1 , "won" : -1}});
	}

}
