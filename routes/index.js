var users = require('./users');
var countries = require('./countries');
var states = require('./states');
var cities = require('./cities');
var leagues = require('./leagues');
var tournaments = require('./tournaments');
var players = require('./players');
var images = require('./images');
var zones = require('./zones');
var teams = require('./teams');
var matchdays = require('./matchdays');
var matches = require('./matches');
var chronicles = require('./chronicles');
var suspensions = require('./suspensions');
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
	players(app);
	zones(app);
	teams(app);
	matchdays(app);
	matches(app);
	images(app);
	chronicles(app);
	suspensions(app);
	// Error handlers
	errors(app);

}


