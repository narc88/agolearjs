var validator = require('validator');
var mongoose = require('mongoose');
var ImageSchema = require('../models/image').ImageSchema;

var MatchdaySchema  =  exports.MatchdaySchema = new mongoose.Schema({
    matchday_number	: { 
				type: String,
				required:true
            },
     matchday_name   : { 
                type: String,
                required:true
            },
    dispute_day     : {type: Date, default: Date.now },
    matches     : [{type: mongoose.Schema.ObjectId, ref: 'Match' }],
    images 		: [ImageSchema],
    closed		:  {type:Boolean, default: false},
    played      :  {type:Boolean, default: false},
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now }
});

exports.Schema = MatchdaySchema;
exports.MatchdayModel = mongoose.model('Matchday', MatchdaySchema);