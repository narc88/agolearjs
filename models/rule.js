// Creación de la Conexión
var mongoose = require('mongoose');
var ImageSchema 	= require('../models/image').ImageSchema;

var RuleSchema = exports.Schema = new mongoose.Schema({
	title				: { type: String, required:true, trim:true},
	content				: { type: String, required:true, trim:true},
	created        		: { type: Date, default: Date.now },
	images              : [ImageSchema],
	modified       		: { type: Date, default: Date.now }
});

exports.RuleModel = mongoose.model('Rule', RuleSchema);