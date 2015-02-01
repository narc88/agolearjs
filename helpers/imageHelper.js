
exports.oneImageSrc = function(images, type, id, resource){
	var root = "/photos/"+resource;
	for (var i = images.length - 1; i >= 0; i--) {
		if(images[i].type === type){
			return root+"/"+images[i].filename
		}
	};	
}


//Funciones extra para chequear relacion con el deal, o similares
