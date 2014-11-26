var validator = require('validator');
var mongoose = require('mongoose');

var SoccerFieldSchema = new mongoose.Schema({
    name                :{type:String},
	created		    	:{type: Date, default: Date.now },
	modified			:{type: Date, default: Date.now }
});

exports.SoccerFieldModel = mongoose.model('SoccerField', SoccerFieldSchema);