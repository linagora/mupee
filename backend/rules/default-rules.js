'use strict';

var Rule = require('./rule');

var denyAllFirefox = module.exports.denyAllUpgradesForFirefox = new Rule({
  summary: 'Deny all upgrade for Firefox',
  description: 'should return empty updates for all Firefox clients',
  predicate: {
    id: 'productEquals',
    parameters: { product: 'Firefox' }
  },
  action: {
    id: 'deny',
    parameters: {}
  }
});

var denyAllThunderbird = module.exports.denyAllUpgradesForThunderbird = new Rule({
  summary: 'Deny all upgrade for Thunderbird',
  description: 'should return empty updates for all Thunderbird clients',
  predicate: {
    id: 'productEquals',
    parameters: { product: 'Thunderbird' }
  },
  action: {
    id: 'deny',
    parameters: {}
  }
});

module.exports.list = [
  denyAllFirefox,
  denyAllThunderbird
];
