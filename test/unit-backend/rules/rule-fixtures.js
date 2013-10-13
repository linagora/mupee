'use strict';

var Rule = require('../../../backend/rules/rule'),
    branchEquals = require('../../../backend/rules/conditions/branch-equals'),
    latestForBranch = require('../../../backend/rules/actions/latest-for-branch');

module.exports.versionTenToLatestMinor = new Rule({
  summary : 'upgrade application with version 10.x to latest minor update',
  description : 'evaluates if the candidate version is on branch 10, and send back the latest availableupdate',
  condition : {
    id : branchEquals.id,
    matches : branchEquals.for({ branch : 10 }),
    parameters : { branch : 10 }
  },
  action : {
    id : latestForBranch.id,
    apply : latestForBranch.for({ type : 'minor' }),
    parameters : { type : 'minor' }
  }
});

