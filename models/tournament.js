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
				type: Number, default: 20
                },
    number_of_zones : { 
                type: Number, default: 1
                },
    tournament_type : { 
                type: Number, default: 1
                },
    yellow_card_limit : { 
                type: Number, default: 5
                },
    winner_points : { 
                type: Number, default: 3
                },
    tied_points : { 
                type: Number, default: 1
                },
    presentation_points : { 
                type: Number, default: 0
                },
    cant_teams_for_next_round : { 
                type: Number, default: 0
                },
    double_playoff_match : { 
                type: Boolean, default: false
                },
    double_league_match : { 
                type: Boolean, default: false
                },
    closed : { 
                type: Boolean, default: false
                },
    suspension_increment : {
                type: Boolean, default: true
                },
    rule    :  { type: mongoose.Schema.ObjectId, ref: 'Rule' },
    champion : { type: mongoose.Schema.ObjectId, ref: 'Team' },
    images      : [ImageSchema],
    zones : [{ type: mongoose.Schema.ObjectId, ref: 'Zone' }],
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now }
});

exports.TournamentModel = mongoose.model('Tournament', TournamentSchema);