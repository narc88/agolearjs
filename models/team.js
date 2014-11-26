var validator = require('validator');
var mongoose = require('mongoose');
var ImageSchema = require('../models/image').ImageSchema;

var TeamSchema = new mongoose.Schema({
    name	: { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAlphanumeric(v.replace(/\s/g, '')); },
                     'Nombre invalido, solo se aceptan letras y números'
                 	]
                },
    players     : [{type: mongoose.Schema.ObjectId, ref: 'Player' }],
    images 		: [ImageSchema],
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now }
});

exports.TeamModel = mongoose.model('Team', TeamSchema);