'use strict';

var request = require('request'),
    parser = require('libxml-to-js'),
    MozillaUpdate = require('./mozilla-update').MozillaUpdate,
    MozillaPatch = require('./mozilla-update').MozillaPatch,
    MozillaSourceVersion = require('./mozilla-source-version');

var mozUpdateUrl = require('./config').fetch.remoteHost;

exports.fetch = function(version, callback) {
  var urlPath = version.buildUrl(mozUpdateUrl);

  var onXmlData = function(error, response, body) {

    if (error) {
      return callback(error, version);
    }

    var musVersion;

    try {
      musVersion = new MozillaSourceVersion(version);
    } catch (error) {
      return callback(error, version);
    }

    parser(body, function(error, result) {
      if (!result.update) {
        return callback(null, musVersion);
      }

      var update = new MozillaUpdate(result.update['@']);

      var patchToAdd = result.update.patch;
      if (!(patchToAdd instanceof Array)) {
        patchToAdd = [patchToAdd];
      }

      var addPatchToUpdate = function(parsedPatch) {
        var patch = new MozillaPatch(parsedPatch['@']);
        update.addPatch(patch);
      };

      try {
        patchToAdd.forEach(addPatchToUpdate);
        musVersion.addUpdate(update);
      } catch (error) {
        return callback(error, version);
      }

      callback(null, musVersion);
    });

  };

  request.get(urlPath, onXmlData).on('error', function(e) {
    return callback(e, version);
  });
};
