'use strict';

var Action = require('../action.js'),
    filterLatestForBranch = require('./action-utils').filterLatestForBranch,
    isPredicatePresent = require('./action-utils').isPredicatePresent;

var latestForCurrentBranch = new Action({
  id: 'latestForCurrentBranch',
  summary: 'upgrade to latest release of the current branch',
  description: 'this policy send updates only for the latest available release of the client current ' +
               'branch (major version)',
  isCompatibleWithPredicates: function(predicates) {return isPredicatePresent(predicates, 'productEquals');},
  action: function(parameters) {
    return function(candidate) {
      return filterLatestForBranch(candidate.branch, candidate);
    };
  }
});

module.exports = latestForCurrentBranch;
