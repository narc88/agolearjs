var validator = require('validator');
var mongoose = require('mongoose');

var FieldSchema = new mongoose.Schema({
    name                :{type:String},
	created		    	:{type: Date, default: Date.now },
	league        :{type: mongoose.Schema.ObjectId, ref: 'League' },
	modified			:{type: Date, default: Date.now }
});

exports.FieldModel = mongoose.model('Field', FieldSchema);