var validator = require('validator');
var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
    name	: { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAlpha(v); },
                     'Nombre invalido, no se aceptan numeros ni simbolos'
                 	]
                },
    players     : [{type: mongoose.Schema.ObjectId, ref: 'Player' }],
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now }
});

exports.TeamModel = mongoose.model('Team', TeamSchema);