'use strict';

var productMapper = require('../../product-mapper'),
    CandidateTypes = require('../candidate-types');

var Predicate = require('../predicate.js');

var extProductEquals = new Predicate({
  id: 'extProductEquals',
  summary: 'extension\'s product equals',
  description: 'true if the extension product compatibility matches the given parameter',
  weight: 4,
  allowedCandidate: CandidateTypes.ExtensionSourceVersion,
  predicate: function(candidate, parameters) {
    return (candidate.appID === productMapper.idFromName(parameters.product));
  },
  parametersDefinitions: [{
    id: 'product',
    summary: 'product name',
    description: 'a Mozilla product name',
    type: 'string',
    mandatory: true
  }]
});

module.exports = extProductEquals;
