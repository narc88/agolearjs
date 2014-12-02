var ImageModel = require('../models/image').ImageModel;
var UserModel = require('../models/user').UserModel;
var TeamModel = require('../models/team').TeamModel;
var PlayerModel = require('../models/player').PlayerModel;
var LeagueModel = require('../models/league').LeagueModel;
var MatchModel = require('../models/match').MatchModel;
var MatchdayModel = require('../models/matchday').MatchdayModel;
var TournamentModel = require('../models/tournament').TournamentModel;
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
			default:
				console.log(req.params)
		}
		return Model;
	}
	var save_image = function(dir){
		return function(req,res){
			var Model = get_model(req.params.param);
			var img = req.files.image.image;
			var format = img.name.substr(img.name.indexOf("."));
			var imageName;

			if(req.body.image.name.trim()){
				imageName = req.body.image.name + format;
			}else{
				imageName = img.name;
			}
			var source_file = img.path;

			//Revisar path
			var destination_file = dir+"/"+req.params.param+"/"+req.param.elem_id+"/"+imageName;

			var is = fs.createReadStream(source_file);
			var os = fs.createWriteStream(destination_file);
			var mkdirp = require('mkdirp');
			//crear carpeta
			mkdirp(dir+'/'+req.params.param+'/'+req.param.elem_id, function(err) { 
			    console.log(err);
			    	easyimg.resize({
								     src:source_file, dst:destination_file,
								     width:500, height:500,
								  }).then(
								  function(image) {
								  	/*is.pipe(os);
									is.on('end',function(err) {
										fs.unlinkSync(source_file);
										if(err){
											console.log('Image Writing ERROR!');
											console.log(err);
										}
										var image = new ImageModel();
										image.filename =  imageName;
										Model.findOne({"_id" : req.params.elem_id }).exec(function(err, model){
											model.images.push(image);
											model.save(function(err){
												if(err) throw err;
												res.send(image);
											});
										});
									});*/
								  },
								  function (err) {
								    console.log(err);
								  }
								);
			});
			
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

