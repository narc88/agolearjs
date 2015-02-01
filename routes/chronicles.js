var ChronicleModel 	= require('../models/chronicle').ChronicleModel;
var ImageModel 	= require('../models/image').ImageModel;

var mongoose = require('mongoose');

module.exports = function(app){


	// RESTful routes
	app.get('/api/chronicles', function(req, res, next){
		ChronicleModel.find().exec( function(err, chronicles){
			if (err) throw err;
			res.send(chronicles);
		});
	});

	app.get('/api/chronicles/:id', function(req, res, next){
		ChronicleModel.findOne({ _id: req.params.id }).exec( function(err, chronicle){
			if (err) throw err;
			res.send(chronicle);
		});
	});

	app.post('/api/chronicles', function(req, res){
		var chronicle = new ChronicleModel(req.body)
		chronicle.save(function(err){
			if(err) throw err;
			res.send(chronicle);
		});
	});

	app.put('/api/chronicles/:id', function(req, res, next){
		ChronicleModel.findOne({ _id: req.params.id }).exec( function(err, chronicle){
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

	app.delete('/api/chronicles/:id', function(req, res, next){
		ChronicleModel.remove({ _id: req.params.id }).exec( function(err, chronicle){
			if (err) {
				res.send(err)
			} 
			res.send(true);
		});
	});
	//End of RESTful routes
}
