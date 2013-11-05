'use strict';

var productMapper = require('../../product-mapper');

var Predicate = require('../predicate.js');

var extProductEquals = new Predicate({
  id: 'extProductEquals',
  summary: 'extension\'s product equals',
  description: 'true if the extension product compatibility matches the given parameter',
  weight: 4,
  predicate: function(candidate, parameters) {
    return (candidate.appId === productMapper.idFromName(parameters.product));
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
