// Creación de la Conexión
var mongoose = require('mongoose');


var ChronicleSchema = new mongoose.Schema({
	title				: { type: String, required:true, trim:true},
	summary				: { type: String, trim:true},
	content				: { type: String, required:true, trim:true},
	created        		: { type: Date, default: Date.now },
	modified       		: { type: Date, default: Date.now }
});

exports.ChronicleModel = mongoose.model('Chronicle', ChronicleSchema);