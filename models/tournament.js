var validator = require('validator');
var mongoose = require('mongoose');
var ImageSchema = require('../models/image').ImageSchema;

var TournamentSchema = new mongoose.Schema({
	name	: { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAlphanumeric(v); },
                     'Nombre invalido, no se aceptan numeros ni simbolos'
                 	]
                },
    number_of_teams	: { 
				type: Number
                },
    number_of_zones : { 
                type: Number
                },
    tournament_type : { 
                type: Number
                },
    yellow_card_limit : { 
                type: Number
                },
    winner_points : { 
                type: Number
                },
    tied_points : { 
                type: Number
                },
    presentation_points : { 
                type: Number
                },
    cant_teams_for_next_round : { 
                type: Number
                },
    double_playoff_match : { 
                type: Boolean
                },
    double_league_match : { 
                type: Boolean
                },
    closed : { 
                type: Boolean
                },
    suspension_increment : {
                type: Boolean
                },
    images      : [ImageSchema],
    zones : [{ type: mongoose.Schema.ObjectId, ref: 'Zone' }],
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now }
});

exports.TournamentModel = mongoose.model('Tournament', TournamentSchema);