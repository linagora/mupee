'use strict';

var fetcher = require('./extension-update-fetcher'),
    Path = require('path'),
    fs = require('fs'),
    Downloader = require('./downloader'),
    logger = require('./logger'),
    config = require('./config'),
    extensions = require('./routes/admin/extensions');

exports = module.exports = function(clientVersion, callback) {
  if (!config.download.autoCache) {
    return callback();
  }

  fetcher.fetch(clientVersion, function(err, musVersion) {
    if (err) {
      logger.error('While fetching extension updates from remote server: ', err);
      return callback();
    }

    if (!musVersion.updates.length) {
      return callback();
    }

    var downloader = new Downloader();
    var update = musVersion.updates[0];
    var fileName = Path.basename(update.targetApplication.updateLink);
    var destination = Path.join(config.download.dir, 'Extensions', clientVersion.id, update.version, fileName);

    function cb(err) {
      if (err) {
        logger.error('While downloading %s from Mozilla Updates Server: %s', fileName, err);
        return callback();
      }

      extensions.uploadXpi({
        files: {
          file: {
            name: fileName,
            size: fs.statSync(destination).size,
            path: destination
          }
        }
      }, {
        send: callback
      });
    }

    downloader.on('finish', cb).on('error', cb);
    downloader.download(update.targetApplication.updateLink, destination);
  });
};
