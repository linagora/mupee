'use strict';

var SourceVersion = require('../backend/source-version'),
  DbProvider = require('../backend/mongo-provider'),
  MetadataStorage = require('../backend/metadata-storage'),
  UpdateFetcher = require('../backend/update-fetcher'),
  Downloader = require('../backend/downloader'),
  Path = require('path'),
  fs = require('fs');

var logger = require('../backend/logger'),
    config = require('../backend/config');

exports.emptyUpdates = function(request, response) {
  response.send(new SourceVersion({}).updatesAsXML());
};

exports.emptyUpdates = function(request, response) {
  response.send(new SourceVersion({}).updatesAsXML());
};

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

        var saveAndSendResponse = function() {
          storage.save(result, function(error, stored) {
            if (error) {
              logger.error('while saving fetched updates to storage :', error);
            }
          });

          response.send(result.updatesAsXML());
        };

        if (result.updates && result.updates.length > 0 && config.download.autoCache) {
          var tasks = [];
          var downloader = new Downloader();

          result.updates.forEach(function (update) {
            update.patches.forEach(function (patch) {
              var destination = Path.join(
                  clientVersion.product,
                  update.version || update.appVersion,
                  update.buildId,
                  clientVersion.buildTarget,
                  clientVersion.locale,
                  'binary');

              tasks.push({
                url: patch.url,
                destination: Path.join(config.download.dir, destination),
                localPath: destination,
                patch: patch
              })
            });
          });

          downloader.on('finish', saveAndSendResponse);
          downloader.on('finish-task', function(err, task) {
            if (err) {
              logger.error('while fetching from remote server :', error);
            }

            task.patch.localPath = task.localPath;
          });

          downloader.downloadAll(tasks);
        } else {
          saveAndSendResponse();
        }
      });
    }
    else {
      logger.info('client with IP [%s] gets cache-hit for url: [%s]', request.ip, request.url);
      response.send(new SourceVersion(storedVersion[0]).updatesAsXML());
    }
  });
};
