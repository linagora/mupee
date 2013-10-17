'use strict';

var RuleAction = require('../rule-action.js');

var deny = new RuleAction({
  id : 'deny',
  summary : 'Deny all upgrades',
  description : '',
  action : function(parameters) {
    return function(candidate) {
      return [];
    };
  },
  parametersDefinitions : []
});

module.exports = deny;
