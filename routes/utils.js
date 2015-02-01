var MatchModel = require('../models/match').MatchModel;
var TournamentModel = require('../models/tournament').TournamentModel;
var mongoose = require('mongoose');

module.exports = function(app){
	app.get('/api/menu', function(req, res, next){
		TournamentModel.find().populate({path:'zones', select: '_id name'}).exec( function(err, tournaments){
			if (err) throw err;
			res.send(tournaments);
		});
	});
}