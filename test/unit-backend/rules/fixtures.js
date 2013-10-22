'use strict';

var Rule = require('../../../backend/rules/rule'),
    branchEquals = require('../../../backend/rules/predicates/branch-equals'),
    latestForBranch = require('../../../backend/rules/actions/latest-for-branch');

module.exports.versionTenToLatestMinor = new Rule({
  _id: 'versionTenToLatestMinor',
  predicates: [{
    id: branchEquals.id,
    parameters: { branch: 10 }
  }],
  action: {
    id: latestForBranch.id,
    parameters: { branch: "17" }
  }
});
