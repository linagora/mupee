'use strict';

var UpdateFetcher = require('./update-fetcher'),
    Path = require('path'),
    db = require('./mongo-provider'),
    MetadataStorage = require('./update-storage'),
    Downloader = require('./downloader'),
    logger = require('./logger'),
    config = require('./config'),
    async = require('async'),
    SourceVersion = require('./source-version'),
    Update = require('./update.js').Update;

var storage = new MetadataStorage(db);

function getDownloadTasks(localVersion, musVersion) {
  var tasks = [];

  musVersion.updates.forEach(function(update) {
    var localUpdate = new Update(update);
    localUpdate.clearPatches();
    update.patches.forEach(function(patch) {
      if (!localVersion.findPatch(update, patch)) {
        var destination = Path.join(
            localVersion.product,
            update.version || update.appVersion,
            update.buildId,
            localVersion.buildTarget,
            localVersion.locale,
            'binary');

        tasks.push({
          url: patch.url,
          destination: Path.join(config.download.dir, destination),
          localPath: destination,
          patch: patch,
          update: localUpdate
        });
        logger.info('New Mozilla patch to download: ', {url: patch.url, destination: destination});
      }
    });
  });
  return tasks;
}

function saveUpdates(localVersion, callback) {
  storage.save(localVersion, function(error) {
    if (error) {
      logger.error('while saving fetched updates to storage :', error);
    }
    callback();
  });
}

function downloadBinaries(localVersion, musVersion, callback) {
  var tasks = getDownloadTasks(localVersion, musVersion);
  if (!tasks.length) {
    return callback();
  }
  var downloader = new Downloader();
  var onAllDownloadsFinished = function() {
    saveUpdates(localVersion, callback);
  };

  downloader.on('finish', onAllDownloadsFinished);
  downloader.on('finish-task', function(err, task) {
    if (err) {
      return logger.error('while fetching from remote server :', err);
    }
    task.patch.localPath = task.localPath;
    var localUpdate = localVersion.findUpdate(task.update);
    if (localUpdate) {
      var localPatch = localVersion.findPatch(task.update, task.patch);
      if (localPatch) {
        return;
      }
      localUpdate.addPatch(task.patch);
    } else {
      task.update.addPatch(task.patch);
      localVersion.addUpdate(task.update);
    }
  });

  downloader.downloadAll(tasks);
}

function scrap(clientVersion, callback) {
  
  async.parallel([
    function(cb) {
      UpdateFetcher.fetch(clientVersion, function(error, musVersion) {
        if (error) {
          logger.error('while fetching from remote server :', error);
        }
        return cb(error, musVersion);
      });
    },
    function(cb) {
      storage.findByVersion(clientVersion, function(error, localVersion) {
        if (error) {
          logger.error('while retrieving client version from cache :', error);
          return cb(error);
        }
        var localSourceVersion = new SourceVersion(localVersion);
        localSourceVersion._id = localVersion._id;
        return cb(error, localSourceVersion);
      });
    }
  ],
  function(err, results) {
    if (err) {
      return callback();
    }
    var localVersion = results[1],
        musVersion = results[0];
    if (!musVersion.updates || !musVersion.updates.length || !config.download.autoCache) {
      return callback();
    }
    downloadBinaries(localVersion, musVersion, callback);
  });
}

exports = module.exports = scrap;
