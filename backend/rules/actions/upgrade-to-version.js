'use strict';

var Action = require('../action.js'),
    mvc = require('mozilla-version-comparator');

function filterChosenVersion(version, candidate) {
  var filteredUpdates = candidate.updates;
  candidate.clearUpdates();
  filteredUpdates.forEach(function(update) {
    var ver = update.version ? update.version : update.displayVersion;
    if (mvc(ver, version) === 0) {
      candidate.addUpdate(update);
    }
  });

  return candidate;
}

var upgradeToVersion = new Action({
  id: 'upgradeToVersion',
  summary: 'upgrade to a specific version',
  description: 'this policy send the update corresponding to the chosen version',
  action: function(parameters) {
    return function(candidate) {
      return filterChosenVersion(parameters.version, candidate);
    };
  },
  parametersDefinitions: [{
    id: 'version',
    summary: 'version',
    description: 'a version in Mozilla Toolkit version format',
    type: 'sring',
    mandatory: true
  }]
});

module.exports = upgradeToVersion;
