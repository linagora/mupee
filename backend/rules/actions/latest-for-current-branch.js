'use strict';

var Action = require('../action.js'),
    filterLatestForBranch = require('./action-utils').filterLatestForBranch;

var latestForCurrentBranch = new Action({
  id: 'latestForCurrentBranch',
  summary: 'upgrade to latest release of the current branch',
  description: 'this policy send updates only for the latest available release of the client current ' +
               'branch (major version)',
  action: function(parameters) {
    return function(candidate) {
      return filterLatestForBranch(candidate.branch, candidate);
    };
  }
});

module.exports = latestForCurrentBranch;
