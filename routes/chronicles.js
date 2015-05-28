var Models = require('../model_factory');
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/chronicles', function(req, res, next){
		var models = Models(req.tenant);
		models.chronicle.find(req.query).limit(30).sort('-modified').exec( function(err, chronicles){
			if (err) throw err;
			res.send(chronicles);
		});
	});

	app.get('/api/chronicles/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.chronicle.findOne({ _id: req.params.id }).exec( function(err, chronicle){
			if (err) throw err;
			res.send(chronicle);
		});
	});

	app.post('/sapi/chronicles', function(req, res){
		var models = Models(req.tenant);
		var chronicle = new models.chronicle(req.body.chronicle)
		chronicle.save(function(err){
			if(err) throw err;
			res.send(chronicle);
		});
	});

	app.put('/sapi/chronicles/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.chronicle.findOne({ _id: req.params.id }).exec( function(err, chronicle){
			if (err) throw err;
			if(chronicle){
				chronicle.title = req.body.chronicle.title;
				chronicle.summary = req.body.chronicle.summary;
				chronicle.content = req.body.chronicle.content;
				chronicle.modified = new Date();
				chronicle.save(function(err){
					if (err) throw err;
					res.send(chronicle);
				});
			}
		});
	});

	app.delete('/sapi/chronicles/:id', function(req, res, next){
		var models = Models(req.tenant);
		models.chronicle.remove({ _id: req.params.id }).exec( function(err, chronicle){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
