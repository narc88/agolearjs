var Models = require('../model_factory');
var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/sapi/leagues', function(req, res, next){
		var models = Models(req.tenant);
		models.league.find().exec( function(err, leagues){
			if (err) throw err;
			res.send(leagues);
		});
	});

	app.get('/api/leagues/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.league.findOne({ _id: req.params.id }).exec( function(err, league){
			if (err) throw err;
			res.send(league);
		});
	});

	app.get('/api/myleague', function(req, res, next){
		var models = Models(req.tenant);
		models.league.findOne({ 'slug': 'ligaaltosdelparacao' }).exec( function(err, league){
			if (err) throw err;
			console.log(league)
			res.send(league);
		});
	});

	app.post('/sapi/leagues', function(req, res){
		var models = Models(req.tenant);
		var league = new models.league(req.body.league);
		league.save(function(err){
			if(err) throw err;
			req.send(league);
		});
	});

	app.put('/sapi/leagues/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.league.findOne({ _id: req.params.id }).exec( function(err, league){
			if (err) throw err;
			console.log(req.body)
			if(league){
				league.name = req.body.league.name;
				league.slug = req.body.league.slug;
				league.slogan = req.body.league.slogan;
				league.email = req.body.league.email;
				league.introduction = req.body.league.introduction;
				league.description = req.body.league.description;
				league.modified = new Date();
				league.save(function(err){
					if (err) throw err;
					res.send(league);
				});
			}
		});
	});

	app.delete('/sapi/leagues/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.league.remove({ _id: req.params.id }).exec( function(err, league){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
