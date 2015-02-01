// Creación de la Conexión
var mongoose = require('mongoose');
var ImageSchema 	= require('../models/image').ImageSchema;

var ChronicleSchema = new mongoose.Schema({
	title				: { type: String, required:true, trim:true},
	summary				: { type: String, trim:true},
	content				: { type: String, required:true, trim:true},
	created        		: { type: Date, default: Date.now },
	images              : [ImageSchema],
	modified       		: { type: Date, default: Date.now }
});

exports.ChronicleModel = mongoose.model('Chronicle', ChronicleSchema);