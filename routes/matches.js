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

	app.get('/api/matches/:id', function(req, res, next){
		MatchModel.findOne({ _id: req.params.id }).populate("visitor_team").populate("local_team").exec( function(err, match){
			if (err) throw err
			console.log(match)
			FieldModel.populate(match, { path: 'turn.field', select: 'name'}, function(){
				PlayerModel.populate(match, { path: 'visitor_goals.player', select: 'name last_name'}, function(){
					PlayerModel.populate(match, { path: 'local_goals.player', select: 'name last_name'}, function(){
						PlayerModel.populate(match, { path: 'local_incidents.player', select: 'name last_name'}, function(){
							PlayerModel.populate(match, { path: 'visitor_incidents.player', select: 'name last_name'}, function(){
								res.send(match)
							});
						});
					});
				});
			});
		});
	});

	app.post('/api/matches', function(req, res){
		
		var match = new MatchModel(req.body.match);
		match.save(function(err){
			if(err) throw err;
			req.send(match);
		});

		//TODO: Cada vez que guardo necesito levantar los partidos jugados para esta zona y actualizar los valores.
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
		if(req.params.team_role === "local"){
			MatchModel.update(
			    { "_id": req.params.id}, 
			    {$push: {"local_goals": goal}}, callback
			)
		}else{			
			if(req.params.team_role === "visitor"){
				MatchModel.update(
				    { "_id": req.params.id}, 
				    {$push: {"visitor_goals": goal}}, callback
				)
			}
		}
		Model.findOne({ name: 'borne' }, function (err, match){
		  match.name = 'jason borne';
		  match.visits.$inc();
		  match.save();
		});
		
	});

	app.delete('/api/matches/goals/:team_role/:id', function(req, res, next){
		var team_role = ""
		if(req.params.team_role === "Local"){
			team_role = "local_goals";
		}else{
			if(req.params.team_role === "Visitor"){
				team_role = "visitor_goals";
			}			
		}
		var callback = function(err, numAffected, status){
			if(err) throw err;
			res.send(goal);
		}
		var field = team_role + "._id"
		MatchModel.update(
		    { field: req.params.id}, 
		    {$pull: {team_role :{_id : req.params.id }}}, callback
		)
	});

	app.post('/api/matches/incidents/:team_role/:id', function(req, res){
		var team_role = ""
		var incident = new IncidentModel(req.body);
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
	});

	app.delete('/api/matches/incidents/:team_role/:id', function(req, res, next){
		var team_role = ""
		if(req.params.team_role === "Local"){
			team_role = "local_goals";
		}else{
			if(req.params.team_role === "Visitor"){
				team_role = "visitor_goals";
			}			
		}
		var callback = function(err, numAffected, status){
			if(err) throw err;
			res.send(goal);
		}
		var field = team_role + "._id"
		MatchModel.update(
		    { "incidents._id": req.params.id}, 
		    {$pull: {"incidents" :{_id : req.params.id }}}, callback
		)
	});

	app.post('/api/matches/:team_role/:id/players', function(req, res){
		var team_role = ""
		if(req.params.team_role === "Local"){
			team_role = "local_goals";
		}else{
			if(req.params.team_role === "Visitor"){
				team_role = "visitor_goals";
			}			
		}
		var callback = function(err, numAffected, status){
			if(err) throw err;
			req.send(true);
		}
		MatchModel.update(
		    { _id: req.params.id}, 
		    {$push: {$each:{team_role: req.body.players}}}, callback
		)
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
