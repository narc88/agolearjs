var MatchModel = require('../models/match').MatchModel;
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/matches', function(req, res, next){
		MatchModel.find().exec( function(err, matches){
			if (err) throw err;
			res.send(matches);
		});
	});

	app.get('/api/matches/:id', function(req, res, next){
		MatchModel.findOne({ _id: req.params.id }).exec( function(err, match){
			if (err) throw err;
			res.send(match);
		});
	});

	app.post('/api/matches', function(req, res){
		var match = new MatchModel(req.body.match);
		match.save(function(err){
			if(err) throw err;
			req.send(match);
		});
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
	app.post('/api/matches/:id/goals', function(req, res){
		var team_role = ""
		var goal = new GoalModel(req.body.goal);
		if(req.body.team_role === "Local"){
			team_role = "local_goals";
		}else{			
			if(req.body.team_role === "Visitor"){
				team_role = "visitor_goals";
			}
		}
		var callback = function(err, numAffected, status){
			if(err) throw err;
			req.send(goal);
		}
		MatchModel.update(
		    { _id: req.params.id}, 
		    {$push: {team_role: goal}, callback}
		)
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
			req.send(goal);
		}
		var field = team_role + "._id"
		MatchModel.update(
		    { field: req.params.id}, 
		    {$pull: {team_role :{_id : req.params.id }}, callback}
		)
	});

	app.post('/api/matches/:id/incidents', function(req, res){
		var incident = new IncidentModel(req.body.incident);
		var callback = function(err, numAffected, status){
			if(err) throw err;
			req.send(incident);
		}
		MatchModel.update(
		    { _id: req.params.id}, 
		    {$push: {team_role: incident}, callback}
		)
	});

	app.delete('/api/matches/incidents/:id', function(req, res, next){
		var callback = function(err, numAffected, status){
			if(err) throw err;
			req.send(goal);
		}
		var field = team_role + "._id"
		MatchModel.update(
		    { "incidents._id": req.params.id}, 
		    {$pull: {"incidents" :{_id : req.params.id }}, callback}
		)
	});

	//No convendria guardarlo con los nombres? Habria que usar el objeto embebido 
	//en el modelo de participaciones para el form y mandar los datos necesarios
	app.post('/api/matches/:id/players', function(req, res){
		var callback = function(err, numAffected, status){
			if(err) throw err;
			req.send(true);
		}
		if(req.body.team_role === "Local"){
			team_role = "local_players";
		}else{			
			if(req.body.team_role === "Visitor"){
				team_role = "visitor_players";
			}
		}
		MatchModel.update(
		    { _id: req.params.id}, 
		    {$push: {$each:{team_role: req.body.players}}, callback}
		)
	});

	app.delete('/api/matches/incidents/:match_id/:team_role/:id', function(req, res, next){
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
		    {$pull: {team_role : req.params.id }, callback}
		)
	});
}
