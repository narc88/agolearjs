var Models = require('../model_factory');

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/tournaments', function(req, res, next){
		var models = Models(req.tenant);
		models.tournament.find().sort('name').exec( function(err, tournaments){
			if (err) throw err;
			res.send(tournaments);
		});
	});

	app.get('/api/tournaments/:zone_id/fairPlayTable', function(req, res, next){

		var countAppearances = function(list, value,  value2){
        var count= 0;
        for (var i = 0; i < list.length; i++) {
          if((list[i]._id.team.equals(value)) && (list[i]._id.type === value2) ){
            count = count + list[i].total;
          }
        };
        return count;
      };
      var getMonthPoints = function(list, team,  month){
        var count= 0;
        for (var i = 0; i < list.length; i++) {
          if((list[i]._id.team.equals(team)) && (list[i]._id.month == month) ){
          	console.log(list[i]._id.type)
            if(list[i]._id.type === 'Amonestación'){
              count++;
            }else if(list[i]._id.type === 'Doble Amonestación'){
              count += 3;
            }else if(list[i]._id.type === 'Expulsión'){
              count += 5;
            }
          }
        };
        return count;
      };

		var d = new Date();
		var year = d.getMonth()+1;
		var models = Models(req.tenant);
		
		models.zone.findOne({ _id: req.params.zone_id }).exec( function(err, zone){
			var tournament_id = mongoose.Types.ObjectId(zone.tournament);
			models.player.aggregate(
				{ $unwind : "$incidents" },
				{ $match: { 'incidents.tournament': tournament_id }},
				{ $project: { 'month' : { $month: '$incidents.created'}, 'incidents._id': 1,  'incidents.player':1, 'incidents.team':1, 'incidents.incident_type':1,  'incidents.tournament':1}},
				{ $group : { '_id' : { 'month' : '$month', 'team' : '$incidents.team', 'type' : '$incidents.incident_type'} ,
							 'total' : { $sum: 1}
							}
				},
				function (err, incidents){
					if (err) throw err;
					var today = new Date();
					var participants_fairplay = [];
			        for (var i = 0; i < zone.participations.length; i++) {
			           	var participation = zone.participations[i];
			           	var fairPlay = {};
			           	fairPlay.team = zone.participations[i].team;
			            fairPlay.total_double_yellow_cards = countAppearances( incidents , participation.team, 'Doble Amonestación');
			            fairPlay.total_red_cards = countAppearances( incidents , participation.team,  'Expulsión');
			            fairPlay.total_yellow_cards = countAppearances( incidents , participation.team,  'Amonestación');
						fairPlay.this_month_points = getMonthPoints( incidents, participation.team, today.getMonth()+1 ); 
			         	fairPlay.last_month_points = getMonthPoints( incidents, participation.team, today.getMonth() );
			           	fairPlay.total_points = fairPlay.total_double_yellow_cards*3 + fairPlay.total_red_cards*5  +fairPlay.total_yellow_cards;
			           	participants_fairplay.push(fairPlay);
			        };
					res.send({'fairPlay': participants_fairplay})
				});
			});
	});

	app.get('/api/tournaments/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.tournament.findOne({ _id: req.params.id }).exec( function(err, tournament){
			if (err) throw err;
			res.send(tournament);
		});
	});

	app.post('/sapi/tournaments', function(req, res){
		var models = Models(req.tenant);
		//Recibir datos del formular.

		//Creacion de zonas clásicas.
		var tournament = new models.tournament(req.body);

		function nextChar(c, i) {
		    return String.fromCharCode(c.charCodeAt(0) + i);
		}

		for (var i = 0; i < tournament.number_of_zones ; i++) {
			nextChar('A', i);
			zone = new models.zone();
			zone.zone_type = "League";
			zone.tournament = tournament._id;
			if(req.body.type_of_zone_name === 1){
				zone.name = nextChar('A', i);
			}else{
				zone.name = i+1;
			}
			zone.save(function(err){
					if (err) throw err;
				});
			console.log(zone);
			tournament.zones.push(zone._id);

		};
		if(tournament.tournament_type === 2){
			zone = new models.zone();
			zone.name = "Eliminatoria";
			zone.zone_type  = "Playoff";
			zone.tournament = tournament._id;
			zone.save(function(err){
					if (err) throw err;
				});
			console.log(zone);
			//TODO: Generar partidos de playoff
			tournament.zones.push(zone._id);
		}
		if(tournament.tournament_type === 3){
			zone = new models.zone();
			zone.name = "Zona Final";
			zone.tournament = tournament._id;
			zone.zone_type  = "League";
			//TODO: Cantidad de clasificados?.
			zone.save(function(err){
					if (err) throw err;
				});
			console.log(zone);
			tournament.zones.push(zone._id);
		}
		tournament.save(function(err){
			if(err) throw err;
			res.send(tournament);
		});
	});

	app.put('/sapi/tournaments/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.tournament.findOne({ _id: req.params.id }).exec( function(err, tournament){
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

	app.delete('/sapi/tournaments/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.tournament.remove({ _id: req.params.id }).exec( function(err, tournament){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes


	app.put('/api/tournaments/:id/markAsClosed', function(req, res, next){
		var models = Models(req.tenant);
		models.tournament.findOne({ _id: req.params.id }).exec( function(err, tournament){
			if (err) throw err;
			if(tournament){
				tournament.closed = true;
				tournament.modified = new Date();
				tournament.save(function(err){
					if (err) throw err;
					res.send(true);
				});
			}
		});
	});

	app.post('/sapi/tournaments/:tournament_id/teams', function(req, res, next){
		var models = Models(req.tenant);
		function shuffle(array) {
		  var currentIndex = array.length, temporaryValue, randomIndex ;
		  while (0 !== currentIndex) {
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		  }

		  return array;
		}

		var selected_teams = req.body.teams;
		models.tournament.findOne({_id :req.params.tournament_id}).populate('zones').exec( function(err, tournament){
			if (err) throw err;
			console.log(tournament)
			var zones_id = [];
			for (var i = 0; i < tournament.zones.length; i++) {
				if(tournament.zones[i].zone_type == 'League'){
					zones_id.push(tournament.zones[i]._id);
				}
			};
			console.log(zones_id)
			if(zones_id.length != tournament.number_of_zones){
				res.send({'error':'Ha ocurrido un error en la generación de las zonas, por favor, borre este torneo y cree uno nuevo.'});
			}
			models.team.find({_id :{ $in : selected_teams}}).exec( function(err, teams){
				if (err) throw err;
				teams = shuffle(teams);

				if(teams.length == tournament.number_of_teams){
					var participants = [];
					for (var i = 0; i < tournament.number_of_zones; i++) {
						participants[i] = []; 
					};
					var zoneIndex = 0;
					for (var i = 0; i < teams.length; i++) {
						if(zoneIndex < tournament.number_of_zones-1){
							zoneIndex++;
						}else{
							zoneIndex = 0;
						}
						var participation = new models.participation();
						participation.team_name = teams[i].name;
						participation.team = teams[i]._id;
						participants[zoneIndex].push(participation);

					};
					for (var i = 0; i < zones_id.length; i++) {
						var cont = 1;
						var callback = function(err, numAffected, status){
							if(err) throw err;
							if(cont == zones_id.length){
								setTimeout(function(){ res.send(participants) }, 150);
							}
							cont = cont +1;
						}
						var zone_id = zones_id[i];
						var zone_participants = participants[i];

						console.log(zone_participants)
						models.zone.update({ _id: zone_id}, {"$set": {"participations": []}}, function(err, numAffected, status){})
						models.zone.update(
							    { _id: zone_id}, 
							    {$push: {"participations": { $each: zone_participants }}}, callback)
						
					};
				}else{
					res.send({'error':'Ha elegido una cantidad inválida de equipos. Ha elegido '+teams.length+' y debía elegir '+tournament.number_of_teams});
				}
			});
		});
	});
}
