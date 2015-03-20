var validator = require('validator');
var mongoose = require('mongoose');


var TurnSchema = new mongoose.Schema({
    hour                :{type:Number, default: 0},
    minute              :{type:Number, default: 0},
    day                 :{type:Number, default: 0},
    field        :{type: mongoose.Schema.ObjectId, ref: 'Field' },
    league        :{type: mongoose.Schema.ObjectId, ref: 'League' },
	created		    	:{type: Date, default: Date.now },
	modified			:{type: Date, default: Date.now }
});
exports.TurnSchema = TurnSchema;
exports.TurnModel = mongoose.model('Turn', TurnSchema);