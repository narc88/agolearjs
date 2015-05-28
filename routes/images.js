var Models = require('../model_factory');
var validator = require('validator');
var fs = require('fs');

module.exports = function(app){
	var get_model = function(model_name, models){
		var Model;
		switch(model_name){
			case "users":
				Model = models.user;
			break;
			case "team":
				Model = models.team;
			break;
			case "player":
				Model = models.player;
			break;
			case "league":
				Model = models.league;
			break;
			case "match":
				Model = models.match;
			break;
			case "matchday":
				Model = models.matchday;
			break;
			case "tournament":
				Model = models.tournament;
			break;
			case "chronicle":
				Model = models.chronicle;
			break;
			case "advertising":
				Model = models.advertising;
			break;
			default:
				console.log(req.params)
		}
		return Model;
	}
	var save_image = function(dir){
		return function(req,res){
			var models = Models(req.tenant);
			var path = dir+req.params.param+'/'+req.params.elem_id;
			//Al path hay que agregarle el tenant id
			console.log(path)
			
			//crear carpeta
			var save_image = function(path){
				var Model = get_model(req.params.param, models);
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
				var image = new models.image();
				image.filename =  validator.toString(image._id +"."+ extension);
				image.type =  req.body.type;
				var destination_file = path+"/"+image.filename;
				var base64Data = req.body.imageBase64Content.split(',')[1];
				var elem_id = req.params.elem_id;
				fs.writeFile( destination_file, base64Data, 'base64', function(err) {
				 if (err) console.log(err);
				 if (err) res.send({'error' : 'La imagen es demasiado grande'});
				});
				Model.findOne({"_id" :  elem_id}).exec(function(err, model){
					console.log(model.images)
					console.log(image)
					model.images.push(image);
					model.save(function(err){
						if (err) console.log(err);
						if (err) res.send({'error' : 'La imagen es demasiado grande'});
						res.send(image);
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

	app.post('/sapi/images/:param/:elem_id', save_image(app.get('photos')));

	var delete_image = function(dir){
		return function(req,res){
			var models = Models(req.tenant);
			var path = dir+req.params.param+'/'+req.params.param_id;
			//Al path hay que agregarle el tenant id
			var Model = get_model(req.params.param);
			Model.findOne({"_id" :  req.params.param_id}).exec(function(err, model){
				for (var i = model.images.length - 1; i >= 0; i--) {
					if(model.images[i]._id == req.params.image_id){
						image_to_erase = model.images[i];
					}
				};
				fs.unlink(path+'/'+image_to_erase.filename, function (err) {
				  if (err) throw err;
				  Model.update(
					  { _id: req.params.param_id },
					  { $pull: {images:{ '_id': req.params.image_id } }}
					).exec(function(err, numAffected){
						console.log(err)
						console.log(numAffected)
						res.send(req.params.image_id)
					})	
				});
			});
						
		}
	}

	app.delete('/sapi/images/:param/:param_id/:image_id', delete_image(app.get('photos')));
}

