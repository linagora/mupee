'use strict';

var Rule = require('../../../backend/rules/rule');
var branchLesserOrEqual = require('../../../backend/rules/rule-condition').branchLesserOrEqual;
var filterLatest = require('../../../backend/rules/rule-action').filterLatest;

module.exports.versionsUpToTenToLatestMinor = new Rule({
  summary : 'rule with two parameters',
  description : 'this rule has two parameters : a boolean and a string',
  condition : branchLesserOrEqual.for({ branch : 10 }),
  action : filterLatest.for({ type : 'minor' })
});

