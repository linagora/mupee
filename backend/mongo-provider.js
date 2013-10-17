'use strict';

var driver = require('mongoskin');
var config = require('./config');

var db = driver.db(config.database.url, config.database.options);

module.exports = db;
