'use strict';

var Predicate = require('../predicate.js'),
    CandidateTypes = require('../candidate-types'),
    versionSplitter = require('../../version-splitter');

var extBranchEquals = new Predicate({
  id: 'extBranchEquals',
  summary: 'extension\'s product branch equals',
  description: 'true if the extension product branch matches the given parameter',
  weight: 4,
  allowedCandidate: CandidateTypes.ExtensionSourceVersion,
  predicate: function(candidate, parameters) {
    return (versionSplitter.getBranch(candidate.appVersion) === parameters.branch);
  },
  parametersDefinitions: [{
    id: 'branch',
    summary: 'product branch',
    description: 'a Mozilla product branch',
    type: 'number',
    mandatory: true
  }]
});

module.exports = extBranchEquals;
