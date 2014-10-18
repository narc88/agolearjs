var validator = require('validator');
var mongoose = require('mongoose');

var MatchdaySchema = new mongoose.Schema({
    matchday_number	: { 
				type: Number,
				required:true
            },
    dispute_day     : {type: Date, default: Date.now },
    matches     : [{type: mongoose.Schema.ObjectId, ref: 'Match' }],
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now }
});

exports.MatchdayModel = mongoose.model('Matchday', MatchdaySchema);