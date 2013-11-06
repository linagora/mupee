'use strict';

var Action = require('../action.js'),
    filterLatestForBranch = require('./action-utils').filterLatestForBranch,
    isPredicatePresent = require('./action-utils').isPredicatePresent;

var latestForBranch = new Action({
  id: 'latestForBranch',
  summary: 'upgrade up to latest release of a given branch',
  description: 'this policy send updates up to the latest available release of a given branch (major version)',
  isCompatibleWithPredicates: function(predicates) {return isPredicatePresent(predicates, 'productEquals');},
  action: function(parameters) {
    return function(candidate) {
      return filterLatestForBranch(parameters.branch, candidate);
    };
  },
  parametersDefinitions: [{
    id: 'branch',
    summary: 'branch',
    description: 'a Mozilla product branch (major version number)',
    type: 'number',
    mandatory: true
  }]
});

module.exports = latestForBranch;
