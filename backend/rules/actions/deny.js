'use strict';

var Action = require('../action.js');

var deny = new Action({
  id: 'deny',
  summary: 'deny all upgrades',
  description: 'this policy disable all updates',
  isCompatibleWithPredicates: function() {return true;},
  action: function(parameters) {
    return function(version) {
      version.clearUpdates();
      return version;
    };
  },
  parametersDefinitions: []
});

module.exports = deny;
