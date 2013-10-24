'use strict';

var parser = require('libxml-to-js'),
    Extension = require('./extension').Extension;

function getElementValueIgnoringNS(node, element) {
  var key = Object.keys(node).filter(function(key) { return key.match(element + '$'); })[0];

  return key ? node[key] : null;
}

function getElementValuesIgnoringNS(node, element, mapper) {
  var subNode = getElementValueIgnoringNS(node, element);

  if (!subNode) {
    return [];
  }

  if (subNode instanceof Array) {
    return subNode.map(mapper);
  }

  return [mapper(subNode)];
}

function parseTargetApplication(node) {
  var subNode = getElementValueIgnoringNS(node, 'Description');

  if (!subNode) {
    return null;
  }

  var targetApplication = {};

  ['id', 'minVersion', 'maxVersion'].forEach(function(key) {
    targetApplication[key] = getElementValueIgnoringNS(subNode, key);
  });

  return targetApplication;
}

exports = module.exports = function(data, callback) {
  // https://developer.mozilla.org/en/docs/Install_Manifests
  parser(data, function(err, rdf) {
    if (err) {
      return callback(err);
    }

    var root = rdf[Object.keys(rdf).filter(function(key) { return key !== '@'; })[0]];

    if (!root) {
      return callback('The specified stream is not a valid install.rdf');
    }

    var extension = {};

    ['id', 'name', 'version', 'description', 'creator', 'homepageURL', 'iconURL'].forEach(function(key) {
      extension[key] = getElementValueIgnoringNS(root, key);
    });
    extension.targetPlatforms = getElementValuesIgnoringNS(root, 'targetPlatform', function(node) { return node['#'] || node; });
    extension.targetApplications = getElementValuesIgnoringNS(root, 'targetApplication', parseTargetApplication);

    try {
      extension = new Extension(extension);
    } catch (err) {
      return callback(err);
    }

    callback(null, extension);
  });
};
