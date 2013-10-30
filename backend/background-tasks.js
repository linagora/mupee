'use strict';

var scraper = require('./mozilla-updates-server-scraper'),
    scheduler = require('./job-scheduler'),
    db = require('./mongo-provider'),
    UpdateStorage = require('./update-storage'),
    storage = new UpdateStorage(db),
    SourceVersion = require('./source-version'),
    logger = require('./logger');

var buildHash = function(clientVersion) {
  return clientVersion.buildUrl('');
};

exports.addProductScraperTask = function(clientVersion) {
  scheduler.addJob(buildHash(clientVersion), function(callback) {
    scraper(clientVersion, callback);
  });
};

exports.refreshProductUpdates = function() {
  function queueScrapTask(err, sv) {
    if ( err ) {
      return logger.error('Unable to fetch source versions from datastore',err);
    }
    
    if ( sv == null) { return ; }
    
    try {
      var sourceVersion = new SourceVersion(sv);
    } catch (e) {
      logger.error(e);
      return logger.error('SourceVersion validation failed');
    }
    
    exports.addProductScraperTask(sourceVersion);
    logger.debug('SourceVersion added for scraping: ',sourceVersion.shortDescription());
  };

  storage.findAll({}).batchSize(10).each(queueScrapTask);
};
