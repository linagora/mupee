'use strict';

var ExtensionSourceVersion = require('../extension-source-version').ExtensionSourceVersion,
    parseInstallRdf = require('../extension-install-rdf-parser'),
    logger = require('../logger'),
    Zip = require('adm-zip'),
    Path = require('path'),
    config = require('../config'),
    fs = require('fs-extra');

function badRequest(res, err, filename) {
  logger.error(filename ? filename + ': ' + err : err);

  res.send(400);
}

exports.versionCheck = function(req, res) {
  res.send(new ExtensionSourceVersion(req.query).updatesAsRDF());
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

    var newPath = Path.join(config.download.dir, 'Extensions', extension.id, extension.version, file.name);

    fs.copy(file.path, newPath, function(err) {
      if (err) {
        return logger.error('Cannot copy uploaded extensions %s to %s. ', file.name, newPath, err);
      }

      logger.info('Successfully stored uploaded extension %s in %s', file.name, newPath);
    });
  });
};
