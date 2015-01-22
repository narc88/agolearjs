var SuspensionModel 	= require('../models/suspension').SuspensionModel;
var MatchModel = require('../models/match').MatchModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/suspensions', function(req, res, next){
		SuspensionModel.find().exec( function(err, suspensions){
			if (err) throw err;
			res.send(suspensions);
		});
	});

	app.get('/api/suspensions/:id', function(req, res, next){
		SuspensionModel.findOne({ _id: req.params.id }).exec( function(err, suspension){
			if (err) throw err;
			res.send(suspension);
		});
	});

	app.post('/api/suspensions', function(req, res){
		var suspension = new SuspensionModel(req.body.suspension);
		suspension.save(function(err){
			if(err) throw err;
			req.send(suspension);
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
				console.log(match)
				var suspension = new SuspensionModel(req.body);
				if(match_role === "local_suspension"){
					console.log(match.local_suspensions)
					match.local_suspensions.push(suspension);
				}else{			
					if(match_role === "visitor_suspension"){
						match.visitor_suspensions.push(suspension);
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
