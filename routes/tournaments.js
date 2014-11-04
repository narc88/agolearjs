var TournamentModel = require('../models/tournament').TournamentModel;
var ZoneModel = require('../models/zone').ZoneModel;
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/tournaments', function(req, res, next){
		TournamentModel.find().exec( function(err, tournaments){
			if (err) throw err;
			res.send(tournaments);
		});
	});

	app.get('/api/tournaments/:id', function(req, res, next){
		TournamentModel.findOne({ _id: req.params.id }).populate({path:'zones', select: 'name'}).exec( function(err, tournament){
			if (err) throw err;
			res.send(tournament);
		});
	});

	app.post('/api/tournaments', function(req, res){
		//Recibir datos del formulario

		//Cuantos equipos

		//Creacion de zonas clásicas.
		var tournament = new TournamentModel(req.body.tournament);
		for (var i = tournament.number_of_zones.length - 1; i >= 0; i--) {
			zone = new ZoneModel();
			zone.zone_type = "League";
			zone.name = i;
			tournament.zones.push(zone._id);

		};
		if(tournament.tournament_type === 2){
			zone = new ZoneModel();
			zone.name = "Eliminatoria";
			zone.zone_type  = "Playoff";
			//TODO: Generar partidos de playoff
			tournament.zones.push(zone._id);
		}
		if(tournament.tournament_type === 3){
			zone = new ZoneModel();
			zone.name = "Zona Final";
			zone.zone_type  = "League";
			//TODO: Cantidad de clasificados?.
			tournament.zones.push(zone._id);
		}
		tournament.save(function(err){
			if(err) throw err;
			req.send(tournament);
		});
	});

	app.put('/api/tournaments/:id', function(req, res, next){
		TournamentModel.findOne({ _id: req.params.id }).exec( function(err, tournament){
			if (err) throw err;
			if(tournament){
				tournament.name = req.body.tournament.name;
				tournament.modified = new Date();
				tournament.save(function(err){
					if (err) throw err;
					res.send(tournament);
				});
			}
		});
	});

	app.delete('/api/tournaments/:id', function(req, res, next){
		TournamentModel.remove({ _id: req.params.id }).exec( function(err, tournament){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
