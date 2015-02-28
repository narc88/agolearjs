var SuspensionModel 	= require('../models/suspension').SuspensionModel;
var ZoneModel 	= require('../models/zone').ZoneModel;
var MatchModel = require('../models/match').MatchModel;
var TeamModel = require('../models/team').TeamModel;
var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/suspensions', function(req, res, next){
		SuspensionModel.find(req.query).exec( function(err, suspensions){
			if (err) throw err;
			res.send(suspensions);
		});
	});

	//Reacondicionar
	app.get('/api/suspensionsByTeam', function(req, res, next){
		var team_id = req.query.team
		TeamModel.findOne({"_id":team_id}).exec( function(err, team){
			if (err) throw err;
			players = team.players;
			SuspensionModel.find({ "accomplished" : false,"player":{$in : players }}).populate("player").exec( function(err, suspensions){
				if (err) throw err;
				res.send(suspensions);
			});
		});
		
	});

	app.get('/api/suspensions/suspendedPlayers', function(req, res, next){
		SuspensionModel.find({ "accomplished": false }).exec( function(err, suspensions){
			if (err) throw err;
			var suspended =[];
			for (var i = suspensions.length - 1; i >= 0; i--) {
				suspended.push(suspensions[i].player)
			};
			res.send(suspended);
		});
	});

	//Called from matches view
	app.post('/api/suspensions/:role/:id', function(req, res, next){
		var match_role = '';
		if(req.params.role === "local"){
			match_role = "local_suspension";
		}else if(req.params.role === "visitor"){
			match_role = "visitor_suspension";
		}
		MatchModel.findOne({ _id: req.params.id }).exec( function(err, match){
			if (err) throw err;
			if(match){
				var suspension = new SuspensionModel(req.body);
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

	app.put('/api/suspensions/:id', function(req, res, next){
		SuspensionModel.findOne({ _id: req.params.id }).exec( function(err, suspension){
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

	app.delete('/api/suspensions/:id', function(req, res, next){
		SuspensionModel.remove({ _id: req.params.id }).exec( function(err, suspension){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
