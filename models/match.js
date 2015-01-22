var validator = require('validator');
var mongoose = require('mongoose');
var GoalSchema = require('./goal').GoalSchema;
var IncidentSchema = require('./incident').IncidentSchema;
var TurnSchema = require('./turn').TurnSchema;
var ImageSchema = require('../models/image').ImageSchema;
var PlayerParticipationSchema = require('../models/player_participation').PlayerParticipationSchema;

var ParticipationPlayer = new mongoose.Schema({
    _id     : {type: mongoose.Schema.ObjectId, ref: 'Player' }
  , name      : String
  , last_name      : String
})

var MatchSchema = new mongoose.Schema({
    start_datetime     : {type: Date, default: Date.now },
    winner	     		: {type: mongoose.Schema.ObjectId, ref: 'Team' },
    local_team     		: {type: mongoose.Schema.ObjectId, ref: 'Team' },
    visitor_team	 	: {type: mongoose.Schema.ObjectId, ref: 'Team' },
    local_goals  	    : [GoalSchema],
    visitor_goals	    : [GoalSchema],
    turn     			: {type: mongoose.Schema.ObjectId, ref: 'Turn' },
    local_incidents	    : [IncidentSchema],
    visitor_incidents   : [IncidentSchema],
    mvp     			: {type: mongoose.Schema.ObjectId, ref: 'Player' },
    local_suspensions         : [{type: mongoose.Schema.ObjectId, ref: 'Suspension' }],
    visitor_suspensions         : [{type: mongoose.Schema.ObjectId, ref: 'Suspension' }],
    //Players who assisted to the match
    local_players       : [PlayerParticipationSchema],
    visitor_players     : [PlayerParticipationSchema],
    //referees			: [RefereeSchema],
    turn                : [TurnSchema],
    matchday   			: {type: mongoose.Schema.ObjectId, ref: 'Matchday' },
    images              : [ImageSchema],
    played				: {
               				 type: Boolean
               			 },
    parent              : {type: mongoose.Schema.ObjectId, ref: 'Match' },                   
	created		    	: {type: Date, default: Date.now },
	modified			: {type: Date, default: Date.now }
});

exports.MatchModel = mongoose.model('Match', MatchSchema);