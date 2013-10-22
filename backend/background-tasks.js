'use strict';

var scraper = require('./mozilla-updates-server-scraper'),
    scheduler = require('./job-scheduler');

var buildHash = function(clientVersion) {
  return clientVersion.buildUrl('');
};

exports.addProductScraperTask = function(clientVersion) {
  scheduler.addJob(buildHash(clientVersion), function(callback) {
    scraper(clientVersion, callback);
  });
};
