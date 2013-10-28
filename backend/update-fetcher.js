'use strict';

var request = require('request'),
    parser = require('libxml-to-js'),
    Update = require('./update.js').Update,
    Patch = require('./update.js').Patch,
    SourceVersion = require('./source-version');

var mozUpdateUrl = require('./config.js').fetch.remoteHost;

exports.fetch = function(version, callback) {
  var urlPath = version.buildUrl(mozUpdateUrl);

  var onXmlData = function(error, response, body) {

    if (error) {
      return callback(error, version);
    }
    var musVersion = new SourceVersion(version);
    parser(body, function(error, result) {

      if (!result.update) {
        return callback(null, musVersion);
      }

      var update = new Update(result.update['@']);

      var patchToAdd = result.update.patch;

      if (!(patchToAdd instanceof Array)) {
        patchToAdd = [patchToAdd];
      }

      var addPatchToUpdate = function(parsedPatch) {
        var patch = new Patch(parsedPatch['@']);
        patch.url = parsedPatch['@'].URL;
        update.addPatch(patch);
      };

      patchToAdd.map(addPatchToUpdate);
      musVersion.addUpdate(update);

      callback(null, musVersion);
    });

  };

  request.get(urlPath, onXmlData).on('error', function(e) {
    return callback(e, version);
  });
};
