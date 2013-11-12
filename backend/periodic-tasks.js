'use strict';

var backgroundTasks = require('./background-tasks');
var config = require('./config');
var defaultRefreshIntervalHours = 24;

var intervalId = null;

exports = module.exports = {
  start: function() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    var interval = parseInt(config.fetch.refreshInterval, 10);
    if (isNaN(interval)) {
      interval = defaultRefreshIntervalHours;
    }
    interval = interval * 60 * 60 * 1000;

    intervalId = setInterval(function() {
      backgroundTasks.refreshProductUpdates();
      backgroundTasks.refreshExtensionUpdates();
    }, interval);
  }
};
