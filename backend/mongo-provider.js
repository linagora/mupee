'use strict';

var driver = require('mongoskin');
var config = require('./config');

exports.db = function() {
  return driver.db(config.database.url, config.database.options);
};
