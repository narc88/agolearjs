// Creación de la Conexión
var mongoose = require('mongoose');

var RefereeSchema = new mongoose.Schema({
	name		:{ type: String, required: true},
	last_name   :{ type: String, required: true},
	created     :{ type: Date, default: Date.now },
	modified    :{ type: Date, default: Date.now }
})


exports.Schema = RefereeSchema;
exports.RefereeModel = mongoose.model('Referee', RefereeSchema);