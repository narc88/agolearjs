var users = require('./users');
var countries = require('./countries');
var images = require('./images');

var errors = require('./errors');

module.exports = function(app){
	app.get('/', function(req, res){
	  res.render('index');
	});

	app.get('/partials/users/:name', function (req, res) {
		var name = req.params.name;
		res.render('partials/users/'+name);
	});

	users(app);
	countries(app);
	images(app);
	
	// Error handlers
	errors(app);

}


