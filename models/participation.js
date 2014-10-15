var validator = require('validator');
var mongoose = require('mongoose');
var GoalSchema = require('./goal').GoalSchema;
var IncidentSchema = require('./incident').IncidentSchema;

var PaticipationSchema = new mongoose.Schema({
    team     		    : {type: mongoose.Schema.ObjectId, ref: 'Team' },
    //Needs to be updated
    team_name	 	    : {type: String},
    //own_goals
    own_goals : { type: Number, default:0},
    //other_goals
    other_goals : { type: Number, default:0},
    //won
    won : { type: Number, default:0},
    //lost
    lost : { type: Number, default:0},
    //tied
    tied : { type: Number, default:0},
    //points
    points : { type: Number, default:0},
    //initials
        //own_goals
        initial_own_goals : { type: Number, default:0},
        //other_goals
        initial_other_goals : { type: Number, default:0},
        //won
        initial_won : { type: Number, default:0},
        //lost
        initial_lost : { type: Number, default:0},
        //tied
        initial_tied : { type: Number, default:0},
        //points
        initial_points : { type: Number, default:0},        
	created		    	: {type: Date, default: Date.now },
	modified			: {type: Date, default: Date.now }
});

exports.PaticipationModel = mongoose.model('Paticipation', PaticipationSchema);