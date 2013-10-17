'use strict';

var Action = require('../action.js');

var deny = new Action({
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
