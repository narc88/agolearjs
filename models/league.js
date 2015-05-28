var validator = require('validator');
var mongoose = require('mongoose');
var ImageSchema = require('../models/image').ImageSchema;

var LeagueSchema = new mongoose.Schema({
	name	: { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAlpha(v.replace(/\s/g, '')); },
                     'Nombre invalido, no se aceptan numeros ni simbolos'
                 	]
                },
    slug	: { 
				type: String,
				trim: true,
				validate : [
                     function(v) { return validator.isAlpha(v.replace(/\s/g, '')); },
                     'Nombre invalido, no se aceptan numeros ni simbolos'
                 	]
                },
	slogan	: { 
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
    introduction	: { 
				type: String,
				trim: true
                },
    description	: { 
				type: String,
				trim: true
                },
    tournaments : [{ type: mongoose.Schema.ObjectId, ref: 'Tournament' }],
    images      : [ImageSchema],
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now }
});
exports.Schema = LeagueSchema;
exports.LeagueModel = mongoose.model('League', LeagueSchema);