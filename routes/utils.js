var Models = require('../model_factory');
var mongoose = require('mongoose');

module.exports = function(app){
	app.get('/api/menu', function(req, res, next){
		var models = Models(req.tenant);
		models.tournament.find({}, "name").exec( function(err, tournaments){
			var tournaments_menu = {};
			models.zone.find({}, "name zone_type tournament").exec( function(err, zones){
				if (err) throw err;
				tournaments_menu.tournaments = tournaments;
				tournaments_menu.zones = zones;
				res.send(tournaments_menu)
			});
		});

	});
}