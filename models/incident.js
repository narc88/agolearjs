var validator = require('validator');
var mongoose = require('mongoose');

var IncidentSchema = new mongoose.Schema({
    minute              : {type: Number},
    player     			: {type: mongoose.Schema.ObjectId, ref: 'Player' },
    incident_type		: {
               				 type: String
               			 },
    detail				: {
               				 type: String
               			 },
	created		    	: {type: Date, default: Date.now },
	modified			: {type: Date, default: Date.now }
});

exports.IncidentModel = mongoose.model('Incident', IncidentSchema);