var MatchdayModel = require('../models/matchday').MatchdayModel;
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/matchdays', function(req, res, next){
		MatchdayModel.find().exec( function(err, matchdays){
			if (err) throw err;
			res.send(matchdays);
		});
	});

	app.get('/api/matchdays/:id', function(req, res, next){
		MatchdayModel.findOne({ _id: req.params.id }).exec( function(err, matchday){
			if (err) throw err;
			res.send(matchday);
		});
	});

	app.post('/api/matchdays', function(req, res){
		var matchday = new MatchdayModel(req.body.matchday);
		matchday.save(function(err){
			if(err) throw err;
			req.send(matchday);
		});
	});

	app.put('/api/matchdays/:id', function(req, res, next){
		MatchdayModel.findOne({ _id: req.params.id }).exec( function(err, matchday){
			if (err) throw err;
			if(matchday){
				matchday.name = req.body.matchday.name;
				matchday.modified = new Date();
				matchday.save(function(err){
					if (err) throw err;
					res.send(matchday);
				});
			}
		});
	});

	app.delete('/api/matchdays/:id', function(req, res, next){
		MatchdayModel.remove({ _id: req.params.id }).exec( function(err, matchday){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
