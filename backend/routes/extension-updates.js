'use strict';

var ExtensionSourceVersion = require('../extension-source-version').ExtensionSourceVersion,
    ExtensionUpdate = require('../extension-source-version').ExtensionUpdate,
    parseInstallRdf = require('../extension-install-rdf-parser'),
    logger = require('../logger'),
    Zip = require('adm-zip'),
    Path = require('path'),
    config = require('../config'),
    fs = require('fs'),
    fse = require('fs-extra'),
    db = require('../mongo-provider'),
    ExtensionStorage = require('../extension-storage'),
    ExtensionUpdateStorage = require('../extension-update-storage'),
    Extension = require('../extension').Extension,
    checksum = require('checksum'),
    mvc = require('mozilla-version-comparator');

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

          if (knownExt.canBeInstalledOnOSAndArch(clientSourceVersion.appOS, clientSourceVersion.appABI)) {
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

              break; // This returns the latest version, for now
            }
          }
        }
      }

      res.send(clientSourceVersion.updatesAsRDF());
      updateStorage.save(dbSourceVersion, function(err) {
        if (err) {
          logger.warn('While saving an ExtensionSourceVersion in storage: ', err);
        }
      });
    });
  });
};

exports.uploadXpi = function(req, res) {
  if (!req.files || !req.files.file) {
    return badRequest(res, 'You must upload an extension using a \'file\' form element');
  }

  var zipFile, file = req.files.file;

  try {
    zipFile = new Zip(file.path);
  } catch (err) {
    return badRequest(res, 'The uploaded file is not a valid XPI file (' + err + ')', file.name);
  }
  var installRdfEntry = zipFile.getEntry('install.rdf');

  if (!installRdfEntry) {
    return badRequest(res, 'The uploaded file is not a valid XPI file (cannot find install.rdf in archive)', file.name);
  }

  parseInstallRdf(zipFile.readAsText(installRdfEntry), function(err, extension) {
    if (err) {
      return badRequest(res, 'The uploaded file is not a valid XPI file (' + err + ')', file.name);
    }

    logger.info('Handling upload of extension %s v%s (%s, %d byte(s))', extension.id, extension.version, file.name, file.size);
    res.send(extension);

    var storage = new ExtensionStorage(db);
    var storeExtension = function() {
      checksum.file(file.path, function(err, sum) {
        extension.localFile = {
          path: Path.join('Extensions', extension.id, extension.version, file.name),
          hash: 'sha1:' + sum
        };

        var newPath = Path.join(config.download.dir, extension.localFile.path);

        storage.save(extension, function(err) {
          if (err) {
            logger.warn('While saving metadata for extension %s in database: ', err);
          }
        });
        fse.copy(file.path, newPath, function(err) {
          if (err) {
            return logger.error('Cannot copy uploaded extensions %s to %s. ', file.name, newPath, err);
          }

          logger.info('Successfully stored uploaded extension %s in %s', file.name, newPath);
        });
      });
    };

    storage.findByExtension(extension, function(err, existingExtensions) {
      if (err) {
        logger.warn('While fetching an existing extension from storage: ', err);
      }

      if (existingExtensions && existingExtensions.length > 0) {
        var existingExtension = existingExtensions[0];

        fs.exists(Path.join(config.download.dir, existingExtension.localFile.path), function(exists) {
          if (exists) {
            return logger.debug('Extension %s already exists in database and file storage, nothing to do.', file.name);
          }

          logger.warn('Extension %s exists in database but the file isn\'t present on the file system ' +
              'or the metadata is outdated, copying file and replacing metadata...', file.name);
          storage.remove(existingExtension._id.toString(), function(err) {
            if (err) {
              logger.warn('While removing outdated metadata from storage: ', err);
            }
          });

          storeExtension();
        });
      } else {
        storeExtension();
      }
    });
  });
};
