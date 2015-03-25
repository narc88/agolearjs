var validator = require('validator');
var mongoose = require('mongoose');

var FieldReducedSchema = new mongoose.Schema({
	_id     : {type: mongoose.Schema.ObjectId, ref: 'Field' },
    name                :{type:String}
});

var FieldSchema = new mongoose.Schema({
    name                :{type:String},
	created		    	:{type: Date, default: Date.now },
	league        :{type: mongoose.Schema.ObjectId, ref: 'League' },
	modified			:{type: Date, default: Date.now }
});


exports.FieldReducedSchema = FieldReducedSchema;
exports.FieldModel = mongoose.model('Field', FieldSchema);