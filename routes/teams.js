var TeamModel = require('../models/team').TeamModel;
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/teams', function(req, res, next){
		TeamModel.find().exec( function(err, teams){
			if (err) throw err;
			res.send(teams);
		});
	});

	app.get('/api/teams/:id', function(req, res, next){
		TeamModel.findOne({ _id: req.params.id }).exec( function(err, team){
			if (err) throw err;
			res.send(team);
		});
	});

	app.post('/api/teams', function(req, res){
		console.log(req.body)
		var team = new TeamModel(req.body);
		team.validate(function(error) {
		    if (error) {
		      	res.send({ error : error });
		    } else {
		    	team.save(function(err){
					if(err) throw err;
					res.send(team);
				});
			}
		});
	});

	app.put('/api/teams/:id', function(req, res, next){
		TeamModel.findOne({ _id: req.params.id }).exec( function(err, team){
			if (err) throw err;
			if(team){
				team.name = req.body.team.name;
				team.modified = new Date();
				team.save(function(err){
					if (err) throw err;
					res.send(team);
				});
			}
		});
	});

	app.delete('/api/teams/:id', function(req, res, next){
		TeamModel.remove({ _id: req.params.id }).exec( function(err, team){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
