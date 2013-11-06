'use strict';

var Action = require('../action.js'),
    CandidateTypes = require('../candidate-types');

var allow = new Action({
  id: 'allow',
  summary: 'allow all upgrades',
  description: 'this policy enable all available updates',
  allowedCandidates: [CandidateTypes.SourceVersion, CandidateTypes.ExtensionSourceVersion],
  isCompatibleWithPredicates: function() {return true;},
  action: function(parameters) {
    return function(version) {
      return version;
    };
  },
  parametersDefinitions: []
});

module.exports = allow;
