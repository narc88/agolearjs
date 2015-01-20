// Creación de la Conexión
var mongoose = require('mongoose');


var AdvertisingSchema = new mongoose.Schema({
	title				: { type: String, required:true, trim:true},
	description				: { type: String, trim:true},
	link				: { type: String, required:true, trim:true},
	expiration        		: { type: Date, default: Date.now },
	created        		: { type: Date, default: Date.now },
	modified       		: { type: Date, default: Date.now }
});

exports.AdvertisingModel = mongoose.model('Advertising', AdvertisingSchema);