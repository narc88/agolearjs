// Creación de la Conexión
var mongoose = require('mongoose');
var ImageSchema = require('../models/image').ImageSchema;
var validator = require('validator');

var AdvertisingSchema = new mongoose.Schema({
	title				: { type: String, required:true, trim:true},
	description				: { type: String, trim:true},
	type				: { type: String, trim:true},
	link				: { type: String, required:true, trim:true},
	expiration        		: { type: Date, default: Date.now },
	images 				: [ImageSchema],
	created        		: { type: Date, default: Date.now },
	modified       		: { type: Date, default: Date.now }
});

exports.Schema = AdvertisingSchema;
exports.Model = mongoose.model('Advertising', AdvertisingSchema);