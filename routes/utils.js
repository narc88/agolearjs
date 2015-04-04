var MatchModel = require('../models/match').MatchModel;
var TournamentModel = require('../models/tournament').TournamentModel;
var ZoneModel = require('../models/zone').ZoneModel;
var mongoose = require('mongoose');

module.exports = function(app){
	app.get('/api/menu', function(req, res, next){
		TournamentModel.find({}, "name").exec( function(err, tournaments){
			var tournaments_menu = {};
			ZoneModel.find({}, "name zone_type tournament").exec( function(err, zones){
				if (err) throw err;
				tournaments_menu.tournaments = tournaments;
				tournaments_menu.zones = zones;
				res.send(tournaments_menu)
			});
		});

	});
}