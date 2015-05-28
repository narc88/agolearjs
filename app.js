
/**
 * Module dependencies.
 */
var util = require('util');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var private_config = require('./private_config');
var EventEmitter = require('events').EventEmitter;

mongoose.set('debug', true);

mongoose.connect(private_config.connection_driver+private_config.agolear.db_user+':'+private_config.agolear.db_pass+'@'+private_config.connection_string+':'+private_config.connection_port+'/'+private_config.agolear.db_user, function(err){
	if(err) throw err;
	var app = express();
	var server = require('http').createServer(app);
	var io = require('socket.io').listen(server);
	app.io = io;

	require('./middleware')(app);
	util.inherits(app, EventEmitter);
	require('./routes')(app);

	server.listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
});
