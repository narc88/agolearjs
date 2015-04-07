var validator = require('validator');
var mongoose = require('mongoose');
var SuspensionSchema 	= require('../models/suspension').SuspensionSchema;
var ImageSchema = require('../models/image').ImageSchema;

var TeamSchema = new mongoose.Schema({
    name	: { 
				type: String,
				trim: true,
				required:true},
	suspensions: [SuspensionSchema],
    players     : [{type: mongoose.Schema.ObjectId, ref: 'Player' }],
    images 		: [ImageSchema],
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now },
    tenant      : {type: mongoose.Schema.ObjectId, ref: 'League' }
});


exports.TeamModel = mongoose.model('Team', TeamSchema);