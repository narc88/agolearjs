var validator = require('validator');
var mongoose = require('mongoose');

var SuspensionSchema = new mongoose.Schema({
    reason    : { 
                type: String,
                trim: true,
                required:true,
                validate : [
                     function(v) { return validator.isAscii(v); },
                     'Razón invalida, no se aceptan numeros ni simbolos'
                    ]
                },
    //Matches he missed due to the suspension
    matches             : [{type: mongoose.Schema.ObjectId, ref: 'Match' }],
    played				: {
               				 type: Boolean
               			 },
    won                 : { type: Number},
    match              : {type: mongoose.Schema.ObjectId, ref: 'Match' },                   
	created		    	: {type: Date, default: Date.now },
	modified			: {type: Date, default: Date.now }
});

exports.SuspensionModel = mongoose.model('suspension', SuspensionSchema);