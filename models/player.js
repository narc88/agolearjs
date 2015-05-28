var validator = require('validator');
var mongoose = require('mongoose');
var GoalSchema = require('../models/goal').GoalSchema;
var IncidentSchema = require('../models/incident').IncidentSchema;
var ImageSchema = require('../models/image').ImageSchema;

var PlayerSchema = new mongoose.Schema({
	name	: { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAlpha(v.replace(/\s/g, '')); },
                     'Nombre invalido, no se aceptan numeros ni simbolos'
                 	]
                },
    last_name	: { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAlpha(v.replace(/\s/g, '')); },
                     'Nombre invalido, no se aceptan numeros ni simbolos'
                 	]
                },
	dni	: { 
				type: String,
				trim: true
               },
    email	: { 
    			type: String, 
    			validate : [
                     function(v) { return validator.isEmail(v.replace(/\s/g, '')); },
                     'Email inválido'
                 	]
    		},
    phone	: { 
				type: String,
				trim: true,
				},
    team_role  : { 
                type: String,
                trim: true,
                },
    birthdate   : { type: Date},
    address	: { 
				type: String,
				trim: true
                },
    blood_type : { 
                type: String,
                trim: true
                },
    inactive      : {type:Boolean, default:false},
    images      : [ImageSchema],
    goals       : [GoalSchema],
    incidents   : [IncidentSchema],
    suspensions : {type: mongoose.Schema.ObjectId, ref: 'Suspension' },
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now }
});
exports.Schema = PlayerSchema;
exports.PlayerModel = mongoose.model('Player', PlayerSchema);