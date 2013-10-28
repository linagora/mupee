'use strict';

var SourceVersion = require('../source-version'),
    db = require('../mongo-provider'),
    MetadataStorage = require('../update-storage'),
    backgroundTasks = require('../background-tasks');

var logger = require('../logger');

exports.emptyUpdates = function(request, response) {
  response.send(SourceVersion.emptyUpdatesXML());
};

exports.updateClient = function(request, response) {
  var storage = new MetadataStorage(db),
      clientVersion;

  try {
    clientVersion = new SourceVersion({
      product: request.params.product,
      version: request.params.version,
      buildID: request.params.build_id,
      buildTarget: request.params.build_target,
      locale: request.params.locale,
      channel: request.params.channel,
      osVersion: request.params.os_version,
      parameters: request.query
    });
  } catch(error) {
    logger.warning('Unable to convert updateClient request to a SourceVersion:', error);
    response.send(SourceVersion.emptyUpdatesXML());
    return;
  }

  storage.findByVersion(clientVersion, function(error, storedVersion) {
    if (error) {
      logger.error('while retrieving client version from cache :', error);
      response.send(clientVersion.updatesAsXML());
      return;
    }
    if (!storedVersion) {
      logger.info('client with IP [%s] gets cache-miss for url: [%s]:', request.ip, request.url);
      response.send(clientVersion.updatesAsXML());
      clientVersion.timestamp = Date.now();
      storage.save(clientVersion, function(err) {
        if (err) {
          logger.error('Unable to store new SourceVersion');
          return;
        }
        backgroundTasks.addProductScraperTask(clientVersion);
      });
    }
    else {
      logger.info('client with IP [%s] gets cache-hit for url: [%s]', request.ip, request.url);
      response.send(SourceVersion.emptyUpdatesXML());

      storedVersion.timestamp = Date.now();
      storage.save(storedVersion, function(error) {
        if (error) {
          logger.error('while updating timestamp in storage: ', error);
        }
      });
    }
  });
};
