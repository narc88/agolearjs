var validator = require('validator');
var mongoose = require('mongoose');
var GoalSchema = require('./goal').GoalSchema;
var IncidentSchema = require('./incident').IncidentSchema;

var PaticipationSchema = new mongoose.Schema({
    team     		    : {type: mongoose.Schema.ObjectId, ref: 'Team' },
    //Needs to be updated
    team_name	 	    : {type: String},
    //own_goals
    own_goals : { type: Number},
    //other_goals
    other_goals : { type: Number},
    //won
    won : { type: Number},
    //lost
    lost : { type: Number},
    //tied
    tied : { type: Number},
    //points
    points : { type: Number},
    //initials
        //own_goals
        initial_own_goals : { type: Number},
        //other_goals
        initial_other_goals : { type: Number},
        //won
        initial_won : { type: Number},
        //lost
        initial_lost : { type: Number},
        //tied
        initial_tied : { type: Number},
        //points
        initial_points : { type: Number},         
	created		    	: {type: Date, default: Date.now },
	modified			: {type: Date, default: Date.now }
});

exports.PaticipationModel = mongoose.model('Paticipation', PaticipationSchema);