var validator = require('validator');
var mongoose = require('mongoose');

var SuspensionSchema = exports.Schema = new mongoose.Schema({
    reason    : { 
                type: String,
                trim: true,
                },
    player     : {type: mongoose.Schema.ObjectId, ref: 'Player' },
    //Matches he missed due to the suspension
    player_team             : {type: mongoose.Schema.ObjectId, ref: 'Team' },
    match             : {type: mongoose.Schema.ObjectId, ref: 'Match' },
    matches             : [{type: mongoose.Schema.ObjectId, ref: 'Match' }],
    accomplished		: {
               				 type: Boolean, default:false
               			 },
    number_of_matches   : { type: Number},        
    undetermined_time   : { type: Boolean, default: false},           
	created		    	: {type: Date, default: Date.now },
	modified			: {type: Date, default: Date.now }
});
exports.SuspensionSchema = SuspensionSchema;
exports.SuspensionModel = mongoose.model('Suspension', SuspensionSchema);