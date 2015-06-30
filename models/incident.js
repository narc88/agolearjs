var validator = require('validator');
var mongoose = require('mongoose');

var IncidentSchema = new mongoose.Schema({
    minute              : {type: Number},
    player     			: {type: mongoose.Schema.ObjectId, ref: 'Player' },
    tournament          : {type: mongoose.Schema.ObjectId, ref: 'Tournament' },
    team          : {type: mongoose.Schema.ObjectId, ref: 'Team' },
    incident_type		: {
               				 type: String
               			 },
    details				: {
               				 type: String
               			 },
	created		    	: {type: Date, default: Date.now },
	modified			: {type: Date, default: Date.now }
});

exports.IncidentSchema = IncidentSchema;
exports.Schema = IncidentSchema;
exports.IncidentModel = mongoose.model('Incident', IncidentSchema);