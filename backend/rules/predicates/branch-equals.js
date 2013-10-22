'use strict';

var Predicate = require('../predicate.js');

var branchEquals = new Predicate({
  id: 'branchEquals',
  summary: 'branch equals',
  description: 'true if the candidate SourceVersion branch is equal to the branch parameter',
  predicate: function(candidate, parameters) {
    return (candidate.branch === parameters.branch);
  },
  parametersDefinitions: [{
    id: 'branch',
    summary: 'version branch',
    description: 'a Mozilla product version branch',
    type: 'number',
    mandatory: true
  }]
});

module.exports = branchEquals;
