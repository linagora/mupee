'use strict';

var Rule = require('./rule'),
    productEquals = require('./conditions/product-equals'),
    deny = require('./actions/deny');

var denyAllFirefox = module.exports.denyAllUpgradeForFirefox = new Rule({
  summary : 'Deny all upgrade for Firefox',
  description : 'should return empty updates for satisfied condition',
  condition : {
    id : productEquals.id,
    parameters : { product : 'Firefox' }
  },
  action : {
    id : deny.id,
    parameters : {}
  }
});

var denyAllThunderbird = module.exports.denyAllUpgradeForThunderbird = new Rule({
  summary : 'Deny all upgrade for Firefox',
  description : 'should return empty updates for satisfied condition',
  condition : {
    id : productEquals.id,
    parameters : { product : 'Thunderbird' }
  },
  action : {
    id : deny.id,
    parameters : {}
  }
});

module.exports.list = [
  denyAllFirefox,
  denyAllThunderbird
];