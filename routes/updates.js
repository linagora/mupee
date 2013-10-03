'use strict';

var SourceVersion = require('../lib/source-version'),
  DbProvider = require('../lib/mongo-provider'),
  MetadataStorage = require('../lib/metadata-storage'),
  UpdateFetcher = require('../lib/update-fetcher');

var logger = require('../lib/logger'),
  config = require('../lib/config');

exports.updateClient = function(request, response) {
  var db = DbProvider.db();
  var storage = new MetadataStorage(db);

  var clientVersion = new SourceVersion(
    {
      product: request.params.product,
      version: request.params.version,
      buildId: request.params.build_id,
      buildTarget: request.params.build_target,
      locale: request.params.locale,
      channel: request.params.channel,
      osVersion: request.params.os_version,
      parameters: request.query
    });

    storage.findByVersion(clientVersion, function(error, storedVersion) {
    if (error) {
      logger.error('while retrieving client version from cache :',error);
      response.send(clientVersion.updatesAsXML());
    }
    if (!storedVersion || !storedVersion.length) {
      logger.info('client with IP [%s] gets cache-miss for url: [%s]:', request.ip, request.url);
      UpdateFetcher.fetch(clientVersion, function(error, result) {
        if (error) {
          logger.error('while fetching from remote server :', error);
        }
        storage.save(result, function(error, stored) {
          if (error) {
            Logger.error('while saving fetched updates to storage :');
          }
        });
        response.send(result.updatesAsXML());
      });
    }
    else {
      logger.info('client with IP [%s] gets cache-hit for url: [%s]', request.ip, request.url);
      response.send(new SourceVersion(storedVersion[0]).updatesAsXML());
    }
  });
};
