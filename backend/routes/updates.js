'use strict';

var SourceVersion = require('../source-version'),
  db = require('../mongo-provider'),
  MetadataStorage = require('../update-storage'),
  UpdateFetcher = require('../update-fetcher'),
  Downloader = require('../downloader'),
  Path = require('path'),
  fs = require('fs'),
  updatesScraper = require("../mozilla-updates-server-scraper");

var logger = require('../logger'),
    config = require('../config');

exports.emptyUpdates = function(request, response) {
  response.send(new SourceVersion({}).updatesAsXML());
};

exports.emptyUpdates = function(request, response) {
  response.send(new SourceVersion({}).updatesAsXML());
};

exports.updateClient = function(request, response) {
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
      return ;
    }
    if (!storedVersion) {
      logger.info('client with IP [%s] gets cache-miss for url: [%s]:', request.ip, request.url);
      response.send(clientVersion.updatesAsXML());
      clientVersion.timestamp = Date.now();
      storage.save(clientVersion, function(err) {
        if (err) {
          logger.error("Unable to store new SourceVersion");
          return ;
        }
        updatesScraper(clientVersion, function() { logger.debug("scraping finished"); });
      });
    }
    else {
      logger.info('client with IP [%s] gets cache-hit for url: [%s]', request.ip, request.url);
      response.send(new SourceVersion(storedVersion).updatesAsXML());

      storedVersion.timestamp = Date.now();
      storage.save(storedVersion, function(error, stored) {
        if (error) {
          logger.error('while updating timestamp in storage: ', error);
        }
      });
    }
  });
};
