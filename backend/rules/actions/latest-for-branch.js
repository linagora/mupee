'use strict';

var Action = require('../action.js');

var filterLatestForBranch = require('./filter-latest-for-branch');

var latestForBranch = new Action({
  id: 'latestForBranch',
  summary: 'upgrade to latest release of a given branch',
  description: 'this policy send updates only for the latest available release of a given branch (major version)',
  action: function(parameters) {
    return function(candidate) {
      return filterLatestForBranch(parameters.branch, candidate);
    }
  },
  parametersDefinitions: [{
    id: 'branch',
    summary: 'branch (major version number)',
    description: 'a Mozilla product branch (major version number)',
    type: 'number',
    mandatory:  true,
  }]
});

module.exports = latestForBranch;
