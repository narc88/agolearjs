var UserRoles = require('../models/user').UserRoles;

function isUser(user, callback){
	if(user){
		return callback();
	}else{
		return false;
	}
}

function isAdmin(user){
	if(user){
		var index = user.roles.indexOf(UserRoles.getAdmin());
		if (index == -1) {
			return false;
		} else {
			return true;
		}
	}else{
		return false;
	}
	
}

exports.user = function (user) {
	if (!user) {
		return false
	} else {
		return true
	}
}

exports.admin = function (user) {
	return isAdmin(user);
}

//Funciones extra para chequear relacion con el deal, o similares
