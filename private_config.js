var private_config = {}
private_config.connection_driver = 'mongodb://';
private_config.connection_string = "localhost";
private_config.connection_port = '29101';
private_config.default_database = 'agolear';
private_config.mail_user = "noreplygiombu@gmail.com";
private_config.mail_password = "noreplygiombu2014";
private_config.secret_sauce = '5909157350917230edfdsfdsf051752305397';

//Default agolear config
private_config.agolear = {};
private_config.agolear.db_user = 'agolear';
private_config.agolear.db_pass = 'puTOme89te';

//Default admin config
private_config.admin_agolear = {};
private_config.admin_agolear.db_user = 'agolear_admin';
private_config.admin_agolear.db_pass = 'puTOme89te';

//Default tenant config

//ligaaltosdelparacao
private_config.ligaaltosdelparacao = {};
private_config.ligaaltosdelparacao.db_user = 'ligaaltosdelparacao';
private_config.ligaaltosdelparacao.db_pass = 'dram2015adp';

module.exports = private_config;