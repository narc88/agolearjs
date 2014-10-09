var validator = require('validator');
var mongoose = require('mongoose');
var ParticipationSchema = require('./participation').ParticipationSchema;
var MatchdayModel = require('../models/matchday').MatchdayModel;
var MatchModel = require('../models/match').MatchModel;

var ZoneSchema = new mongoose.Schema({
    name	: { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAlpha(v); },
                     'Nombre invalido, no se aceptan numeros ni simbolos'
                 	]
                },
    zone_type     : { 
				type: String,
				trim: true,
				required:true,
				validate : [
                     function(v) { return validator.isAlpha(v); },
                     'Inválido, no se aceptan numeros ni simbolos'
                 	]
                },
    double_match : { 
                type: Boolean
                },
    matchdays     : [{type: mongoose.Schema.ObjectId, ref: 'Matchday' }],
    participations     : [ParticipationSchema],
	created    	: {type: Date, default: Date.now },
	modified	: {type: Date, default: Date.now }
});

ZoneSchema.methods.createMatchdayWithMatches = function createMatchdayWithMatches (participants) {
    var num_matches
    if(participants.length%2 != 0){
        num_matches = (participants.length-1)/2;
    }else{
        num_matches = (participants.length)/2;
    }
    var matchday = new MatchdayModel(req.body.matchday);
    matchday.save(function(err){
        if(err) throw err;
        for (var i = 0; i < num_matches; i++) {
            var match = new MatchModel();
            match.visitor_team = participants.shift();
            match.local_team = participants.shift();
            match.matchday = matchday._id
            match.save();
        };
    });
  return this.model('Animal').find({ type: this.type }, cb);
};


exports.ZoneModel = mongoose.model('Zone', ZoneSchema);