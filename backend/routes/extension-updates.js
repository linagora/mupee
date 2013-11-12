'use strict';

var ExtensionSourceVersion = require('../extension-source-version').ExtensionSourceVersion,
    ExtensionUpdate = require('../extension-source-version').ExtensionUpdate,
    logger = require('../logger'),
    config = require('../config'),
    db = require('../mongo-provider'),
    ExtensionStorage = require('../extension-storage'),
    ExtensionUpdateStorage = require('../extension-update-storage'),
    Extension = require('../extension').Extension,
    mvc = require('mozilla-version-comparator'),
    backgroundTasks = require('../background-tasks'),
    engine = require('../rules/engine');

function badRequest(res, err, filename) {
  logger.error(filename ? filename + ': ' + err : err);

  res.send(400);
}

exports.versionCheck = function(req, res) {
  var clientSourceVersion;

  try {
    clientSourceVersion = new ExtensionSourceVersion(req.query);
  } catch (err) {
    return badRequest(res, err);
  }

  var updateStorage = new ExtensionUpdateStorage(db);
  var dbSourceVersion = new ExtensionSourceVersion(clientSourceVersion);

  updateStorage.findByVersion(clientSourceVersion, function(err, storedSourceVersions) {
    if (err) {
      logger.warn('While fetching an existing ExtensionSourceVersion from storage: ', err);
      return res.send(clientSourceVersion.updatesAsRDF());
    }

    if (storedSourceVersions && storedSourceVersions.length > 0) {
      dbSourceVersion = storedSourceVersions[0];
      dbSourceVersion.timestamp = Date.now();
    }

    var storage = new ExtensionStorage(db);

    storage.findByExtension({ id: clientSourceVersion.id }, function(err, knownExtensions) {
      if (err) {
        logger.warn('While fetching an existing Extension from storage: ', err);
        return res.send(clientSourceVersion.updatesAsRDF());
      }

      if (knownExtensions && knownExtensions.length > 0) {
        var sortedKnownExtensions = knownExtensions.sort(function(a, b) {
          return mvc(b.version, a.version); // In this order because we want the newest first
        });

        for (var i in sortedKnownExtensions) {
          var knownExt = new Extension(sortedKnownExtensions[i]);

          if (mvc(knownExt.version, clientSourceVersion.version) >= 0 &&
              knownExt.canBeInstalledOnOSAndArch(clientSourceVersion.appOS, clientSourceVersion.appABI)) {
            var compatibleApp = knownExt.getCompatibleTargetApplication(clientSourceVersion.appID, clientSourceVersion.appVersion);

            if (compatibleApp) {
              clientSourceVersion.addUpdate(new ExtensionUpdate({
                version: knownExt.version,
                targetApplication: {
                  id: compatibleApp.id,
                  minVersion: compatibleApp.minVersion,
                  maxVersion: compatibleApp.maxVersion,
                  updateLink: config.server.url + ':' + config.server.port + '/download/' + sortedKnownExtensions[i].localFile.path,
                  updateHash: sortedKnownExtensions[i].localFile.hash
                }
              }));
            }
          }
        }
      }

      if (!dbSourceVersion._id) {
        backgroundTasks.addExtensionScraperTask(dbSourceVersion);
      }

      res.send(engine.evaluate(clientSourceVersion).updatesAsRDF());
      updateStorage.save(dbSourceVersion, function(err) {
        if (err) {
          logger.warn('While saving an ExtensionSourceVersion in storage: ', err);
        }
      });
    });
  });
};
