var validator = require('validator');
var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
    matchday_number	: { 
				type: Number,
				required:true
            },
    dispute_day     : {type: Date, default: Date.now },
    matches     : [{type: mongoose.Schema.ObjectId, ref: 'Matchday' }],
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now }
});

exports.GroupModel = mongoose.model('Group', GroupSchema);