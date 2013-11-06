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

var denyAllFirefoxExtensions = module.exports.denyAllUpgradesForFirefoxExtensions = new Rule({
  predicates: [{
    id: 'extProductEquals',
    parameters: { product: 'Firefox' }
  }],
  action: {
    id: 'deny',
    parameters: {}
  }
});

var denyAllThunderbirdExtensions = module.exports.denyAllUpgradesForThunderbirdExtensions = new Rule({
  predicates: [{
    id: 'extProductEquals',
    parameters: { product: 'Thunderbird' }
  }],
  action: {
    id: 'deny',
    parameters: {}
  }
});

module.exports.list = [
  denyAllFirefox,
  denyAllThunderbird,
  denyAllFirefoxExtensions,
  denyAllThunderbirdExtensions
];
