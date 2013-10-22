'use strict';

var Action = require('../action.js');

var deny = new Action({
  id: 'deny',
  summary: 'deny upgrades',
  description: 'This policy disable all upgrades',
  action: function(parameters) {
    return function(version) {
      version.clearUpdates();
      return version;
    };
  },
  parametersDefinitions: []
});

module.exports = deny;
