'use strict';

var Predicate = require('../predicate.js');

var extIdEquals = new Predicate({
  id: 'extIdEquals',
  summary: 'extension\'s id equals',
  description: 'true if the extension id matches the given parameter',
  weight: 4,
  predicate: function(candidate, parameters) {
    return (candidate.id === parameters.id);
  },
  parametersDefinitions: [{
    id: 'id',
    summary: 'extension id',
    description: 'a Mozilla extension ID',
    type: 'string',
    mandatory: true
  }]
});

module.exports = extIdEquals;
