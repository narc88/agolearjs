
var mongoose = require('mongoose');

var ImageSchema =  exports.ImageSchema = new mongoose.Schema({
	filename			: { type: String , required: true, default:"mr_bean.jpg"},
	type			: { type: String , required: true},
	created    		    : {type: Date, default: Date.now },
	modified			: {type: Date, default: Date.now }
})	

exports.ImageModel = mongoose.model('Image', ImageSchema);