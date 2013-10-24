'use strict';

var Predicate = require('../predicate.js');

var branchEquals = new Predicate({
  id: 'branchEquals',
  summary: 'branch equals',
  description: 'true if the candidate branch filed (major version number) matches the given parameter',
  weight: 8,
  predicate: function(candidate, parameters) {
    return (candidate.branch === parameters.branch);
  },
  parametersDefinitions: [{
    id: 'branch',
    summary: 'branch (major version number)',
    description: 'a Mozilla product branch (major version number)',
    type: 'number',
    mandatory: true
  }]
});

module.exports = branchEquals;
