'use strict';

var RuleCondition = require('../rule-condition.js');

var branchEquals = new RuleCondition({
  id : 'branchEquals',
  summary : 'branch equals',
  description : 'true if the candidate SourceVersion branch is equal to the branch parameter',
  predicate : function(candidate, parameters) {
    if (candidate.branch == parameters.branch) {
      return true;
    } else {
      return false;
    }
  },
  parametersDefinitions : [{
    id : 'branch',
    summary : 'version branch',
    description : 'a Mozilla product version branch',
    type : 'number',
    mandatory : true
  }]
});

module.exports = branchEquals;
