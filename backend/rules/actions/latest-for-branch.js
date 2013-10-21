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
        if (update.type === parameters.type) {
          filtered.push(update);
        }
      });
      return filtered.length ?
          filtered.sort(function(left, right) {
            return - versionsCompare(left.version, right.version);
          })[0] : null;
    };
  },
  parametersDefinitions: [{
    id: 'version',
    summary: 'Version number',
    description: 'Mozilla product major version number (i.e. "17")',
    type: 'string',
    mandatory: false,
    defaultValue: 'minor'
  }]
});

module.exports = latestForBranch;
