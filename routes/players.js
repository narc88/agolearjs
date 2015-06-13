var Models = require('../model_factory');

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/players', function(req, res, next){
		var models = Models(req.tenant);
		models.player.find().exec( function(err, players){
			if (err) throw err;
			res.send(players);
		});
	});

	app.get('/api/players/names', function(req, res, next){
		var models = Models(req.tenant);

		var queryArray = req.query._id.split(',');
		if(req.query._id.length > 10){
			models.player.find({"_id" : {$in:  queryArray} }, 'name last_name').exec( function(err, players){
				if (err) throw err;
				res.send(players);
			});
		}else{
			res.send([])
		}
		
	});


	app.get('/api/players/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.player.findOne({ _id: req.params.id }).exec( function(err, player){
			if (err) throw err;
			res.send(player);
		});
	});

	app.post('/sapi/players', function(req, res){
		var models = Models(req.tenant);
		console.log(req.body.player)
		var player = new models.player(req.body.player);
		player.save(function(err){
			if(err) throw err;
			req.send(player);
		});
	});

	app.post('/sapi/players/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.player.findOne({ _id: req.params.id }).exec( function(err, player){
			if (err) throw err;
			if(player){
				player.name = req.body.player.name;
				player.last_name = req.body.player.last_name;
				player.dni = req.body.player.dni;
				player.email = req.body.player.email;
				player.phone = req.body.player.phone;
				player.birthdate = req.body.player.birthdate;
				player.address = req.body.player.address;
				player.blood_type = req.body.player.blood_type;
				player.inactive = req.body.player.inactive;
				player.team_role = req.body.player.team_role;
				player.modified = new Date();
				console.log(player);
				player.save(function(err){
					if (err) throw err;
					res.send(player);
				});
			}
		});
	});

	app.delete('/sapi/players/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.player.remove({ _id: req.params.id }).exec( function(err, player){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
