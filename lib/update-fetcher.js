'use strict';

var request = require('request');
var parser = require('libxml-to-js');
var Update = require('../lib/update.js').Update;
var Patch = require('../lib/update.js').Patch;

var mozUpdateUrl = require('../lib/config.js').fetch.remoteHost;

exports.fetch = function(version, callback) {
  var urlPath = version.buildUrl(mozUpdateUrl);

  var onXmlData = function(error, response, body) {

    if (error) {
      return callback(error, version);
    }

    parser(body, function(error, result) {

      if (!result.update) {
        return callback(null, version);
      }

      var update = new Update(result.update['@']);
      update['buildId'] = result.update['@'].buildID;
      update['detailsUrl'] = result.update['@'].detailsURL;

      var patchToAdd = result.update.patch;

      if(!(patchToAdd instanceof Array)){
        patchToAdd = [patchToAdd];
      }

      var addPatchToUpdate = function(parsedPatch) {
        var patch = new Patch(parsedPatch['@']);
        patch['url'] = parsedPatch['@'].URL;
        update.addPatch(patch);
      };

      patchToAdd.map(addPatchToUpdate);
      version.addUpdate(update);

      callback(null, version);
    });

  };

  request.get(urlPath, onXmlData).on('error', function(e) {
    return callback(e, version);
  });
};
