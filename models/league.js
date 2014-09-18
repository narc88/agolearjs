var validator = require('validator');
var mongoose = require('mongoose');

var BankAccountSchema = new mongoose.Schema({
	name	: { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAlpha(v); },
                     'Nombre invalido, no se aceptan numeros ni simbolos'
                 	]
                },
    slug	: { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAlpha(v); },
                     'Nombre invalido, no se aceptan numeros ni simbolos'
                 	]
                },
	slogan	: { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAscii(v); },
                     'Nombre invalido'
                 	]
                },
    email	: { 
    			type: String, 
    			required: true,
    			validate : [
                     function(v) { return validator.isEmail(v); },
                     'Email inválido'
                 	]
    		},
    introduction	: { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAscii(v); },
                     'Nombre invalido'
                 	]
                },
    description	: { 
				type: String,
				trim: true,
				validate : [
                     function(v) { return validator.isAscii(v); },
                     'Nombre invalido'
                 	]
                },
	user		: { type: mongoose.Schema.ObjectId, ref: 'User' },
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now }
});

exports.BankAccountModel = mongoose.model('BankAccount', BankAccountSchema);