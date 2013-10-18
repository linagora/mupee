'use strict';

var ExtensionSourceVersion = require('../extension-source-version').ExtensionSourceVersion;

exports.versionCheck = function(req, res) {
  res.send(new ExtensionSourceVersion(req.query).updatesAsRDF());
};
