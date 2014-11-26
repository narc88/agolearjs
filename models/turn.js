var validator = require('validator');
var mongoose = require('mongoose');


var TurnSchema = new mongoose.Schema({
    hour                :{type:Number, default: 0},
    minute              :{type:Number, default: 0},
    day                 :{type:Number, default: 0},
    soccer_field        :{type: mongoose.Schema.ObjectId, ref: 'SoccerField' },
	created		    	:{type: Date, default: Date.now },
	modified			:{type: Date, default: Date.now }
});

exports.TurnModel = mongoose.model('Turn', TurnSchema);