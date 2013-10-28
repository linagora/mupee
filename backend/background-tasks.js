'use strict';

var scraper = require('./mozilla-updates-server-scraper'),
    extScraper = require('./mozilla-updates-server-extension-scraper'),
    scheduler = require('./job-scheduler'),
    db = require('./mongo-provider'),
    UpdateStorage = require('./update-storage'),
    storage = new UpdateStorage(db),
    SourceVersion = require('./source-version'),
    logger = require('./logger');

var buildHash = function(clientVersion) {
  return clientVersion.buildUrl('');
};

var buildExtensionHash = function(v) {
  return v.id + '/' + v.version + '/' + v.appID + '/' + v.appVersion + '/' + v.appOS + '/' + v.appABI + '/' + v.locale;
};

exports.addProductScraperTask = function(clientVersion) {
  scheduler.addJob(buildHash(clientVersion), function(callback) {
    scraper(clientVersion, callback);
  });
};

exports.addExtensionScraperTask = function(extensionSourceVersion) {
  scheduler.addJob(buildExtensionHash(extensionSourceVersion), function(callback) {
    extScraper(extensionSourceVersion, callback);
  });
};

exports.refreshProductUpdates = function() {
  function queueScrapTask(err, sv) {
    if (err) {
      return logger.error('Unable to fetch source versions from datastore', err);
    }
    if (sv === null) {
      return;
    }

    var sourceVersion;
    try {
      sourceVersion = new SourceVersion(sv);
    } catch (e) {
      logger.error(e);
      return logger.error('SourceVersion validation failed');
    }

    exports.addProductScraperTask(sourceVersion);
    logger.debug('SourceVersion added for scraping: ', sourceVersion.shortDescription());
  }

  storage.findAll({}).batchSize(10).each(queueScrapTask);
};
