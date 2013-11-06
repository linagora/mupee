'use strict';

var Action = require('../action.js'),
    CandidateTypes = require('../candidate-types');

var deny = new Action({
  id: 'deny',
  summary: 'deny all upgrades',
  description: 'this policy disable all updates',
  allowedCandidates: [CandidateTypes.SourceVersion, CandidateTypes.ExtensionSourceVersion],
  isCompatibleWithPredicates: function() {return true;},
  action: function(parameters) {
    return function(version) {
      version.clearUpdates();
      return version;
    };
  },
  parametersDefinitions: []
});

module.exports = deny;
