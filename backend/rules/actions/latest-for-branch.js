'use strict';

var RuleAction = require('../rule-action.js');

var latestForBranch = new RuleAction({
  id : 'latestForBranch',
  summary : 'upgrade to latest major/minor version',
  description : '',
  action : function(parameters) {
    return function(candidate) {
      var filtered = [];
      candidate.updates.forEach(function(update) {
        if (update.type == parameters.type) {
          filtered.push(update);
        }
      });
      return filtered.length ?
        filtered.sort(function(left, right) {
          return right.version - left.version
        })[0] : null;
    };
  },
  parametersDefinitions : [{
    identifier : 'version-type',
    summary : 'version type',
    description : 'a Mozilla product version type (major/minor)',
    type : 'string',
    mandatory : false,
    defaultValue : 'minor'
  }]
});

module.exports = latestForBranch;
