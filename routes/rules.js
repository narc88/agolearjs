var RuleModel 	= require('../models/rule').RuleModel;
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/rules', function(req, res, next){
		RuleModel.find().exec( function(err, rules){
			if (err) throw err;
			res.send(rules);
		});
	});

	app.get('/api/rules/:id', function(req, res, next){
		RuleModel.findOne({ _id: req.params.id }).exec( function(err, rule){
			if (err) throw err;
			res.send(rule);
		});
	});

	app.post('/api/rules', function(req, res){
		var rule = new RuleModel(req.body)
		rule.save(function(err){
			if(err) throw err;
			res.send(rule);
		});
	});

	app.put('/api/rules/:id', function(req, res, next){
		RuleModel.findOne({ _id: req.params.id }).exec( function(err, rule){
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

	app.delete('/api/rules/:id', function(req, res, next){
		RuleModel.remove({ _id: req.params.id }).exec( function(err, rule){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
