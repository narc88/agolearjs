var Models = require('../model_factory');
var mongoose = require('mongoose');

module.exports = function(app){
	// RESTful routes
	app.get('/api/rules', function(req, res, next){
		var models = Models(req.tenant);
		models.rule.find().exec( function(err, rules){
			if (err) throw err;
			res.send(rules);
		});
	});

	app.get('/api/rules/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.rule.findOne({ _id: req.params.id }).exec( function(err, rule){
			if (err) throw err;
			res.send(rule);
		});
	});

	app.post('/sapi/rules/:tournament_id', function(req, res){
		var models = Models(req.tenant);
		var rule = new models.rule(req.body);
		models.tournament.update({_id : req.params.tournament_id}, {$set : { "rule" : rule.id}},function(err, numAffected, status){
			rule.save(function(err){
				console.log(err);
				console.log(numAffected);
				if(err) throw err;
				res.send(true);
			});
		});
	});

	app.put('/sapi/rules/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.rule.findOne({ _id: req.params.id }).exec( function(err, rule){
			if (err) throw err;
			if(rule){
				rule.title = req.body.rule.title;
				rule.summary = req.body.rule.summary;
				rule.content = req.body.rule.content;
				rule.modified = new Date();
				rule.save(function(err){
					if (err) throw err;
					res.send(rule);
				});
			}
		});
	});

	app.delete('/sapi/rules/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.rule.remove({ _id: req.params.id }).exec( function(err, rule){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes

	app.get('/api/ruless', function(req, res, next){
		// later on inside a route, or wherever
		console.log('rules')
		var models = Models(req.tenant);
		models.user.find().exec( function(err, rules){
			if (err) throw err;
			res.send(rules);
		});
	});

}
