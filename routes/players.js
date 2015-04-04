var PlayerModel = require('../models/player').PlayerModel;
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/players', function(req, res, next){
		PlayerModel.find().exec( function(err, players){
			if (err) throw err;
			res.send(players);
		});
	});

	app.get('/api/players/names', function(req, res, next){
		var queryArray = req.query._id.split(',');
		PlayerModel.find({"_id" : {$in:  queryArray} }, 'name last_name').exec( function(err, players){
			if (err) throw err;
			res.send(players);
		});
	});


	app.get('/api/players/:id', function(req, res, next){
		PlayerModel.findOne({ _id: req.params.id }).exec( function(err, player){
			if (err) throw err;
			res.send(player);
		});
	});

	app.post('/api/players', function(req, res){
		var player = new PlayerModel(req.body.player);
		player.save(function(err){
			if(err) throw err;
			req.send(player);
		});
	});

	app.put('/api/players/:id', function(req, res, next){
		PlayerModel.findOne({ _id: req.params.id }).exec( function(err, player){
			if (err) throw err;
			if(player){
				player.name = req.body.player.name;
				player.modified = new Date();
				player.save(function(err){
					if (err) throw err;
					res.send(player);
				});
			}
		});
	});

	app.delete('/api/players/:id', function(req, res, next){
		PlayerModel.remove({ _id: req.params.id }).exec( function(err, player){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
