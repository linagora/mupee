'use strict';

var scraper = require('./mozilla-updates-server-scraper'),
    extScraper = require('./mozilla-updates-server-extension-scraper'),
    scheduler = require('./job-scheduler'),
    db = require('./mongo-provider'),
    UpdateStorage = require('./update-storage'),
    ExtensionUpdateStorage = require('./extension-update-storage'),
    SourceVersion = require('./source-version'),
    ExtensionSourceVersion = require('./extension-source-version').ExtensionSourceVersion,
    logger = require('./logger');

var updateStorage = new UpdateStorage(db),
    extensionUpdateStorage = new ExtensionUpdateStorage(db);

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
      return logger.error('SourceVersion validation failed', e);
    }

    exports.addProductScraperTask(sourceVersion);
    logger.debug('SourceVersion added for scraping: ', sourceVersion.shortDescription());
  }

  updateStorage.findAll({}).batchSize(10).each(queueScrapTask);
};

exports.refreshExtensionUpdates = function() {
  function queueScrapTask(err, esv) {
    if (err) {
      return logger.error('Unable to fetch extension source versions from datastore', err);
    }
    if (esv === null) {
      return;
    }

    var extensionSourceVersion;
    try {
      extensionSourceVersion = new ExtensionSourceVersion(esv);
    } catch (e) {
      return logger.error('ExtensionSourceVersion validation failed', e);
    }

    exports.addExtensionScraperTask(extensionSourceVersion);
    logger.debug('ExtensionSourceVersion added for scraping: ', extensionSourceVersion.shortDescription());
  }

  extensionUpdateStorage.findAll({}).batchSize(10).each(queueScrapTask);
};
