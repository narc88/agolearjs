var ImageModel = require('../models/image').ImageModel;
var UserModel = require('../models/user').UserModel;
var TeamModel = require('../models/team').TeamModel;
var PlayerModel = require('../models/player').PlayerModel;
var LeagueModel = require('../models/league').LeagueModel;
var MatchModel = require('../models/match').MatchModel;
var MatchdayModel = require('../models/matchday').MatchdayModel;
var TournamentModel = require('../models/tournament').TournamentModel;
var ChronicleModel 	= require('../models/chronicle').ChronicleModel;
var AdvertisingModel 	= require('../models/advertising').AdvertisingModel;
var validator = require('validator');
var fs = require('fs');

module.exports = function(app){
	var get_model = function(model_name){
		var Model;
		switch(model_name){
			case "users":
				Model = UserModel;
			break;
			case "team":
				Model = TeamModel;
			break;
			case "player":
				Model = PlayerModel;
			break;
			case "league":
				Model = LeagueModel;
			break;
			case "match":
				Model = MatchModel;
			break;
			case "matchday":
				Model = MatchdayModel;
			break;
			case "tournament":
				Model = TournamentModel;
			break;
			case "chronicle":
				Model = ChronicleModel;
			break;
			case "advertising":
				Model = AdvertisingModel;
			break;
			default:
				console.log(req.params)
		}
		return Model;
	}
	var save_image = function(dir){
		return function(req,res){
			
			var path = dir+req.params.param+'/'+req.params.elem_id;
			//Al path hay que agregarle el tenant id
			console.log(path)
			
			//crear carpeta
			var save_image = function(path){
				var Model = get_model(req.params.param);
				var imageName;
				var extension = undefined;
				var lowerCase = req.body.imageBase64Content.substr(1, 25).toLowerCase();
				if (lowerCase.indexOf("png") !== -1){
					extension = "png";
				}else if (lowerCase.indexOf("jpg") !== -1){
					extension = "jpg"
				}else if (lowerCase.indexOf("jpeg") !== -1){
				    extension = "jpeg"
				}else if (lowerCase.indexOf("gif") !== -1){
					extension = "gif";
				}
				var image = new ImageModel();
				image.filename =  validator.toString(req.body.filename +"."+ extension);
				image.type =  req.body.type;
				var destination_file = path+"/"+image.filename;
				var base64Data = req.body.imageBase64Content.split(',')[1];
				var elem_id = req.params.elem_id;
				fs.writeFile( destination_file, base64Data, 'base64', function(err) {
				 if (err) console.log(err)
				});
				Model.findOne({"_id" :  elem_id}).exec(function(err, model){
					model.images.push(image);
					model.save(function(err){
						if(err) throw err;
						res.send(model._id, image);
					});
				});
			}
			var create_directory = function(path){
				var mkdirp = require('mkdirp');
				mkdirp(path, function(err) { 
				    if (err) console.log(err)
			    	console.log(fs.existsSync(path))
				    if (fs.existsSync(path)) {
					    save_image(path);
					}else{
						create_directory(path);
					}
			  	});
			};
			create_directory(path);
		}
			
			
	}

	app.post('/images/:param/:elem_id', save_image(app.get('photos')));

	var delete_image = function(dir){
		return function(req,res){
			console.log("me llamaban")
			var Model = get_model(req.params.param);
			
				Model.update(
				  { _id: req.params.param_id },
				  { $pull: { 'images': req.params.image_id } }
				).exec(function(){
					res.send(true)
				})			
		}
	}

	app.get('/images/:param/:param_id/:image_id', delete_image(app.get('photos')));
}

