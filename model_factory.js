var mongoose = require('mongoose');
var fs = require('fs');
var debug = require('debug')('app:middleware:registerModels');

var models = [];
var conns = [];
var path = __dirname + '/models';
var private_config = require('./private_config');

function factory(tenant) {
    console.log(path)
    // if the connection is cached on the array, reuse it
    if (conns[tenant]) {
        debug('reusing connection', tenant, '...');
    } else {
        debug('creating new connection to', tenant, '...');
        //Tenant should be an object saved and encrypted? somewhere?.

        conns[tenant] = mongoose.createConnection(private_config.connection_driver+private_config[tenant].db_user+':'+private_config[tenant].db_pass+'@'+private_config.connection_string+':'+private_config.connection_port+'/'+private_config[tenant].db_user);
    }

    if(models[tenant]) {
        debug('reusing models');
    } else {
        var instanceModels = [];
        var schemas = fs.readdirSync(path);
        debug('registering models');
        schemas.forEach(function(schema) {
            var model = schema.split('.').shift();
            console.log(model)
            console.log(path)
            console.log(schema)
            instanceModels[model] = conns[tenant].model(model, require([path, schema].join('/')).Schema);
        });
        models[tenant] = instanceModels;
    }
    return models[tenant];
}

module.exports = factory;