'use strict';

var Rule = require('./rule');

var denyAllFirefox = module.exports.denyAllUpgradesForFirefox = new Rule({
  predicates: [{
    id: 'productEquals',
    parameters: { product: 'Firefox' }
  }],
  action: {
    id: 'deny',
    parameters: {}
  }
});

var denyAllThunderbird = module.exports.denyAllUpgradesForThunderbird = new Rule({
  predicates: [{
    id: 'productEquals',
    parameters: { product: 'Thunderbird' }
  }],
  action: {
    id: 'deny',
    parameters: {}
  }
});

module.exports.list = [
  denyAllFirefox,
  denyAllThunderbird
];
