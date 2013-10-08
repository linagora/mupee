'use strict';

var nconf = require('nconf');
var defaults = require('../lib/default-config.js');

var config = {};

nconf.argv()
     .env()
     .file({file : 'conf/config.json'})
     .defaults(defaults);

for (var key in defaults) {
  if (defaults.hasOwnProperty(key) && key != 'type') {
     config[key] = nconf.get(key);
  }
}

module.exports = config;
