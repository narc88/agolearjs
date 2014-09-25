var validator = require('validator');
var mongoose = require('mongoose');

var ZoneSchema = new mongoose.Schema({
    matchday_number	: { 
				type: Number,
				required:true
            },
    dispute_day     : {type: Date, default: Date.now },
    matchdays     : [{type: mongoose.Schema.ObjectId, ref: 'Matchday' }],
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now }
});

exports.ZoneModel = mongoose.model('Zone', ZoneSchema);