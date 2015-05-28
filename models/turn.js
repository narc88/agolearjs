var validator = require('validator');
var mongoose = require('mongoose');
var FieldReducedSchema = require('./field').FieldReducedSchema;

var TurnSchema = exports.Schema = new mongoose.Schema({
    hour                :{type:Number, default: 0},
    minute              :{type:Number, default: 0},
    day                 :{type:Number, default: 0},
    field        		:{type: mongoose.Schema.ObjectId, ref: 'Field' },
    league        		:{type: mongoose.Schema.ObjectId, ref: 'League' },
	created		    	:{type: Date, default: Date.now },
	modified			:{type: Date, default: Date.now }
});


var TurnEmbedSchema = new mongoose.Schema({
    _id     : {type: mongoose.Schema.ObjectId, ref: 'Turn' },
    hour                :{type:Number, default: 0},
    minute              :{type:Number, default: 0},
    day                 :{type:Number, default: 0},
    field        		:[FieldReducedSchema]
});

exports.TurnEmbedSchema = TurnEmbedSchema;
exports.TurnSchema = TurnSchema;

exports.TurnModel = mongoose.model('Turn', TurnSchema);