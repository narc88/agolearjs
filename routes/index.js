var users = require('./users');
var countries = require('./countries');
var states = require('./states');
var cities = require('./cities');
var leagues = require('./leagues');
var tournaments = require('./tournaments');
var images = require('./images');

var errors = require('./errors');

module.exports = function(app){
	app.get('/', function(req, res){
	  res.render('index');
	});

	app.get('/partials/:resource/:name', function (req, res) {
		var name = req.params.name;
		var resource = req.params.resource;
		res.render('partials/'+resource+'/'+name);
	});

	users(app);
	countries(app);
	states(app);
	cities(app);
	leagues(app);
	tournaments(app);
//	groups(app);
//	matchdays(app);
//	matches(app);
	images(app);
	
	// Error handlers
	errors(app);

}


