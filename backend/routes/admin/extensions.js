'use strict';

var db = require('../../mongo-provider'),
    Extension = require('../../extension').Extension,
    ExtensionStorage = require('../../extension-storage'),
    productMapper = require('../../product-mapper'),
    parseInstallRdf = require('../../extension-install-rdf-parser'),
    logger = require('../../logger'),
    Zip = require('adm-zip'),
    Path = require('path'),
    config = require('../../config'),
    fs = require('fs'),
    fse = require('fs-extra'),
    checksum = require('checksum'),
    parseChromeManifest = require('../../chrome-manifest-parser'),
    ManifestInstruction = require('../../chrome-manifest').ManifestInstruction,
    BinaryComponentInstruction = require('../../chrome-manifest').BinaryComponentInstruction,
    async = require('async');

var storage = new ExtensionStorage(db);
var supportedParameters = ['product', 'branch'];

function badRequest(res, err, filename) {
  logger.error(filename ? filename + ': ' + err : err);

  return res.send(400, err);
}

exports.findAll = function(req, res) {
  var query = req.query, product = null;

  if (query) {
    var unsupportedParameters = Object.keys(query).filter(function(parameter) {
      return supportedParameters.indexOf(parameter) === -1;
    });

    if (unsupportedParameters.length) {
      return res.send(400, 'Only ' + supportedParameters + ' query parameters are supported');
    }

    if (query.product && !(product = productMapper.idFromName(query.product))) {
      return res.send(400, 'Unkown product \'' + query.product + '\'');
    }
  }

  storage.findAll({}, function(err, results) {
    if (err) {
      return res.send(500, err);
    }

    res.send(results.filter(function(result) {
      return !product || new Extension(result).getCompatibleTargetApplication(product, query.branch);
    }));
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

    var manifestEntry = zipFile.getEntry('chrome.manifest');
    var handleUploadedExtension = function handleUploadedExtension() {
      logger.info('Handling upload of extension %s v%s (%s, %d byte(s))', extension.id, extension.version, file.name, file.size);
      res.send(extension);

      var storage = new ExtensionStorage(db);
      var storeExtension = function() {
        checksum.file(file.path, function(err, sum) {
          extension.localFile = {
            path: Path.join('Extensions', extension.id, extension.version, file.name),
            hash: 'sha1:' + sum
          };
          extension.size = file.size;

          var newPath = Path.join(config.download.dir, extension.localFile.path);

          storage.save(extension, function(err) {
            if (err) {
              logger.warn('While saving metadata for extension %s in database: ', err);
            }
          });

          function copyCallback(err) {
            if (err) {
              return logger.error('Cannot copy uploaded extensions %s to %s. ', file.name, newPath, err);
            }

            logger.info('Successfully stored uploaded extension %s in %s', file.name, newPath);
          }

          if (file.path !== newPath) {
            fse.copy(file.path, newPath, copyCallback);
          } else {
            copyCallback();
          }
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
    };
    var hasBinaryComponent = function hasBinaryComponent(manifestEntry, callback) {
      function firstWaterfallFunction(instruction) {
        return function(asyncCallback) {
          hasBinaryComponent(instruction.path, asyncCallback);
        };
      }

      function nextWaterfallFunction(instruction) {
        return function(found, asyncCallback) {
          if (found) {
            return asyncCallback(null, true);
          }

          hasBinaryComponent(instruction.path, asyncCallback);
        };
      }

      parseChromeManifest(zipFile.readAsText(manifestEntry), function(err, manifest) {
        if (err) {
          return callback(err);
        }

        var subManifests = [];

        for (var i in manifest.instructions) {
          var instruction = manifest.instructions[i];

          if (instruction instanceof BinaryComponentInstruction) {
            return callback(null, true);
          } else if (instruction instanceof ManifestInstruction) {
            subManifests.push(subManifests.length ? nextWaterfallFunction(instruction) : firstWaterfallFunction(instruction));
          }
        }

        if (subManifests.length) {
          return async.waterfall(subManifests, callback);
        }

        callback(null, false);
      });
    };

    if (!manifestEntry) {
      handleUploadedExtension();
    } else {
      hasBinaryComponent(manifestEntry, function(err, result) {
        if (err) {
          return badRequest(res, 'The uploaded file is not a valid XPI file (' + err + ')', file.name);
        }

        extension.hasBinaryComponent = result;
        handleUploadedExtension();
      });
    }
  });
};
