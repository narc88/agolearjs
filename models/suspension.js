var validator = require('validator');
var mongoose = require('mongoose');

var SuspensionSchema = new mongoose.Schema({
    reason    : { 
                type: String,
                trim: true,
                required:true,
                validate : [
                     function(v) { return validator.isAscii(v); },
                     'Razón invalida, solo se aceptan letras y números'
                    ]
                },
    //Matches he missed due to the suspension
    matches             : [{type: mongoose.Schema.ObjectId, ref: 'Match' }],
    accomplished				: {
               				 type: Boolean
               			 },
    number_of_matches                 : { type: Number},
    match              : {type: mongoose.Schema.ObjectId, ref: 'Match' },                   
	created		    	: {type: Date, default: Date.now },
	modified			: {type: Date, default: Date.now }
});

exports.SuspensionModel = mongoose.model('suspension', SuspensionSchema);