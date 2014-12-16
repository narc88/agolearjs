var validator = require('validator');
var mongoose = require('mongoose');

var GoalSchema = new mongoose.Schema({
    minute              : {type: Number},
    player     			: {type: mongoose.Schema.ObjectId, ref: 'Player' },
    own_goal			: {
               				 type: Boolean
               			 },
	created		    	: {type: Date, default: Date.now },
	modified			: {type: Date, default: Date.now }
});
exports.GoalSchema = GoalSchema;
exports.GoalModel = mongoose.model('Goal', GoalSchema);