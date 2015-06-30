var validator = require('validator');
var mongoose = require('mongoose');
var ParticipationSchema = require('../models/participation').ParticipationSchema;
var MatchdaySchema = require('../models/matchday').MatchdaySchema;

var ZoneSchema = exports.Schema = new mongoose.Schema({
    name	: { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAscii(v.replace(/\s/g, '')); },
                     'Nombre invalido, no se aceptan simbolos'
                 	]
                },
    zone_type     : { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAlpha(v.replace(/\s/g, '')); },
                     'Inválido, no se aceptan numeros ni simbolos'
                 	]
                },
    double_match : { 
                type: Boolean
                },
    tournament : {type: mongoose.Schema.ObjectId, ref: 'Tournament' },
    matchdays     : [MatchdaySchema],
    closed : {type:Boolean},
    participations     : [ParticipationSchema],
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now }
});


exports.ZoneModel = mongoose.model('Zone', ZoneSchema);