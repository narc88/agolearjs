var validator = require('validator');
var mongoose = require('mongoose');
var ImageSchema = require('../models/image').ImageSchema;

var MatchdaySchema = new mongoose.Schema({
    matchday_number	: { 
				type: Number,
				required:true
            },
    dispute_day     : {type: Date, default: Date.now },
    matches     : [{type: mongoose.Schema.ObjectId, ref: 'Match' }],
    images 		: [ImageSchema],
    closed		:  {type:Boolean, default: false},
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now }
});

exports.MatchdayModel = mongoose.model('Matchday', MatchdaySchema);