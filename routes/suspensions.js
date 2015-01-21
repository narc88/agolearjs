var SuspensionModel 	= require('../models/suspension').SuspensionModel;
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/suspensions', function(req, res, next){
		SuspensionModel.find().exec( function(err, suspensions){
			if (err) throw err;
			res.send(suspensions);
		});
	});

	app.get('/api/suspensions/:id', function(req, res, next){
		SuspensionModel.findOne({ _id: req.params.id }).exec( function(err, suspension){
			if (err) throw err;
			res.send(suspension);
		});
	});

	app.post('/api/suspensions', function(req, res){
		var suspension = new SuspensionModel(req.body.suspension);
		suspension.save(function(err){
			if(err) throw err;
			req.send(suspension);
		});
	});

	app.put('/api/suspensions/:id', function(req, res, next){
		SuspensionModel.findOne({ _id: req.params.id }).exec( function(err, suspension){
			if (err) throw err;
			if(suspension){
				suspension.name = req.body.suspension.name;
				suspension.modified = new Date();
				suspension.save(function(err){
					if (err) throw err;
					res.send(suspension);
				});
			}
		});
	});

	app.delete('/api/suspensions/:id', function(req, res, next){
		SuspensionModel.remove({ _id: req.params.id }).exec( function(err, suspension){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
