'use strict';

var Action = require('../action.js');

var versionsCompare = require('./version-compare');

var latestForBranch = new Action({
  id: 'latestForBranch',
  summary: 'upgrade to latest release of a specified version',
  description: '',
  action: function(parameters) {
    return function(candidate) {
      var filtered = [];
      candidate.updates.forEach(function(update) {
        if (update.version.split('.').shift() == parameters.branch) {
          filtered.push(update);
        }
      });
      candidate.clearUpdates();
      if ( filtered.length ) {
        filtered.sort(function(left, right) {
          return - versionsCompare(left.version, right.version);
        });
        candidate.addUpdate(filtered[0]);
      }
      return candidate;
    };
  },
  parametersDefinitions: [{
    id: 'branch',
    summary: 'Version number',
    description: 'Mozilla product major version number (i.e. "17")',
    type: 'string',
    mandatory:  true,
    defaultValue: 'minor'
  }]
});

module.exports = latestForBranch;
