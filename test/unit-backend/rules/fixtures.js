'use strict';

var Rule = require('../../../backend/rules/rule'),
    latestForBranch = require('../../../backend/rules/actions/latest-for-branch'),
    branchEquals = require('../../../backend/rules/predicates/branch-equals'),
    productEquals = require('../../../backend/rules/predicates/product-equals'),
    upgradeToversion = require('../../../backend/rules/actions/upgrade-to-version');

module.exports.version10ToLatest17 = new Rule({
  _id: 'version10ToLatest17',
  predicates: [{
    id: branchEquals.id,
    parameters: {branch: 10}
  }],
  action: {
    id: latestForBranch.id,
    parameters: {branch: 17}
  }
});

module.exports.thunderbird10ToLatest17 = new Rule({
  _id: 'thunderbird10ToLatest17',
  predicates: [{
    id: branchEquals.id,
    parameters: {branch: 10}
  },{
    id: productEquals.id,
    parameters: {product: 'Thunderbird'}
  }],
  action: {
    id: latestForBranch.id,
    parameters: {branch: 17}
  }
});

module.exports.invalidRuleAllowedCandidates = new Rule({
  _id: 'invalidRule1',
  predicates: [{
    id: branchEquals.id,
    parameters: {branch: 10}
  },{
    id: productEquals.id,
    parameters: {product: 'Thunderbird'}
  }],
  action: {
    id: upgradeToversion.id,
    parameters: {version: 'foo'}
  }
});

module.exports.invalidRuleNotCompatiblePredicates = new Rule({
  _id: 'invalidRule2',
  predicates: [{
    id: branchEquals.id,
    parameters: {branch: 10}
  }],
  action: {
    id: latestForBranch.id,
    parameters: {branch: 17}
  }
});
