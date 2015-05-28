var validator = require('validator');
var mongoose = require('mongoose');
var ImageSchema = require('../models/image').ImageSchema;

var UserSchema = exports.Schema = new mongoose.Schema({
	username	: { 
				type: String, 
				unique:true,
				required: true,
				validate : [
                     function(v) { return validator.isAlphanumeric(v.replace(/\s/g, '')); },
                     'Nombre inválido, solo se permiten letras y números, sin espacios'
                 	]
			},
	email	: { 
    			type: String, 
    			required: true,
    			validate : [
                     function(v) { return validator.isEmail(v.replace(/\s/g, '')); },
                     'Email inválido'
                 	]
    		},
	encrypted_password : { 
				type: String, 
				required: true
			},
	facebook_id	: { type: Number},
	reset_password_token	: String,
	reset_password_sent_at	: Date,
	name	: { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAlpha(v.replace(/\s/g, '')); },
                     'Nombre invalido, no se aceptan numeros ni simbolos'
                 	]
                },
    lname	: { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAlpha(v.replace(/\s/g, '')); },
                     'Nombre invalido, no se aceptan numeros ni simbolos'
                 	]
                },
	birthdate	: { type: Date, required: true},
	personal_id	: { 
					type: String,
					trim: true,
					required:true,
					validate : [
	                     function(v) { return validator.isNumeric(v.replace(/\s/g, '')); },
	                     'El dni debe ser un valor numérico sin espacios, puntos, ni guiones'
	                 	]
	                },
	gender		: { type: String},
	phone		: { type: String},
	mobile		: { type: String},
	address		: { type: String},
	city		: { type: mongoose.Schema.ObjectId, ref: 'City' },
	zip			: { type: String},
	images 		: [ImageSchema],
	roles 		: [{type:String}],
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now },
	token: String
});

exports.UserModel = mongoose.model('User', UserSchema);


exports.UserRoles = (function(){
	var admin = 'admin';
	var user = 'user';
	var league_admin = 'leagueadmin';
	var player = 'player';

	return{
		list 		: function(){
			return [admin, user, player, league_admin];
		},
		getAdmin 	: function(){
			return admin;
		},
		getUser 	: function(){
			return user;
		},
		getLeagueAdmin 	: function(){
			return league_admin;
		},
		getPlayer	: function(){
			return player;
		}
	}
})();
