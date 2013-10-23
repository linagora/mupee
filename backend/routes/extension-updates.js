'use strict';

var ExtensionSourceVersion = require('../extension-source-version').ExtensionSourceVersion,
    logger = require('../logger');

exports.versionCheck = function(req, res) {
  res.send(new ExtensionSourceVersion(req.query).updatesAsRDF());
};

exports.uploadXpi = function(req, res) {
  if (!req.files || !req.files.file) {
    return res.send(400, 'You must upload an extension using a \'file\' form element');
  }

  var file = req.files.file;

  logger.info('Handling upload of extension \'%s\' (%d byte(s))', file.name, file.size);

  res.send(200);
};
