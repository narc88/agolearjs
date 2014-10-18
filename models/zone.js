var validator = require('validator');
var mongoose = require('mongoose');
var ParticipationSchema = require('./participation').ParticipationSchema;
var MatchdaySchema = require('../models/matchday').MatchdaySchema;

var ZoneSchema = new mongoose.Schema({
    name	: { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAlpha(v); },
                     'Nombre invalido, no se aceptan numeros ni simbolos'
                 	]
                },
    zone_type     : { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAlpha(v); },
                     'Inválido, no se aceptan numeros ni simbolos'
                 	]
                },
    double_match : { 
                type: Boolean
                },
    matchdays     : [MatchdaySchema],
    participations     : [ParticipationSchema],
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now }
});


exports.ZoneModel = mongoose.model('Zone', ZoneSchema);