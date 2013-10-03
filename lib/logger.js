'use strict';

var Winston = require('winston');

var config = require('../lib/config');

var logger = new (Winston.Logger)({
  exitOnError: false
});

if (config.log.console.enabled) {
  logger.add(Winston.transports.Console, config.log.console);
}
if (config.log.file.enabled) {
  logger.add(Winston.transports.File, config.log.file);
}
module.exports = logger;
