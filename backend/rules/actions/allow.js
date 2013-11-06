'use strict';

var Action = require('../action.js');

var allow = new Action({
  id: 'allow',
  summary: 'allow all upgrades',
  description: 'this policy enable all available updates',
  isCompatibleWithPredicates: function() {return true;},
  action: function(parameters) {
    return function(version) {
      return version;
    };
  },
  parametersDefinitions: []
});

module.exports = allow;
