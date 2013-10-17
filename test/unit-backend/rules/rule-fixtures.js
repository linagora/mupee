'use strict';

var Rule = require('../../../backend/rules/rule'),
    branchEquals = require('../../../backend/rules/conditions/branch-equals'),
    productEquals = require('../../../backend/rules/conditions/product-equals'),
    deny = require('../../../backend/rules/actions/deny'),
    latestForBranch = require('../../../backend/rules/actions/latest-for-branch');

module.exports.versionTenToLatestMinor = new Rule({
  summary : 'upgrade application with version 10.x to latest minor update',
  description : 'evaluates if the candidate version is on branch 10, and send back the latest availableupdate',
  condition : {
    id : branchEquals.id,
    parameters : { branch : 10 }
  },
  action : {
    id : latestForBranch.id,
    parameters : { type : 'minor' }
  }
});
