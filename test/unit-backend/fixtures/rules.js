'use strict';

exports.parametersDefinitions = {};
exports.parameters = {};
exports.actions = {};
exports.predicates = {};
exports.rules = {};
exports.rulesActions = {};

exports.parametersDefinitions.branch = function() {
  return {
    id: 'branch',
    summary: 'Version number',
    description: 'Mozilla product major version number (i.e. "17")',
    type: 'string',
    mandatory: true,
    defaultValue: '1'
  };
};

exports.parametersDefinitions.ip = function() {
  return {
    id: 'ip',
    summary: 'IP range',
    description: 'An IP(v4) compatible IP address or range. ' + ' ' +
                  'Examples: 1.2.3.4, 1.3.5.0/24',
    type: 'string',
    mandatory: true,
    defaultValue: '127.0.0.1'
  };
};

exports.parametersDefinitions.lastNumber = function() {
  return {
    id: 'lastNumber',
    summary: 'The last number of the release',
    description: 'A number the release should end up' +
                  'Example: if set as 4, il will allow release 35.4',
    type: 'number',
    mandatory: false,
    defaultValue: null
  };
};

exports.parametersDefinitions.activationDate = function() {
  return {
    id: 'activationDate',
    summary: 'The date this action will be effectively applied',
    description: 'A date / time',
    type: 'number',
    mandatory: true,
    defaultValue: '1'
  };
};

exports.parametersDefinitions.product = function() {
  return {
    id: 'product',
    summary: 'product name',
    description: 'a Mozilla product name',
    type: 'string',
    mandatory: true
  };
};

exports.actions.deny = function() {
  return {
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
  };
};

exports.actions.latestForBranch = function() {
  return {
    id: 'latestForBranch',
    summary: 'upgrade to latest release of a specified version',
    description: '',
    action: function(parameters) {
      return function(candidate) {
      };
    },
    parametersDefinitions: [exports.parametersDefinitions.branch()]
  };
};

exports.actions.latestForIpForBranch = function() {
  return {
    id: 'latestForIpForBranch',
    summary: 'upgrade to latest release of a specified version (when you\'re in a specific network range)',
    description: 'If your IP address is in that rule, you will be able to upgrade to the latest minor release',
    action: function(parameters) {
      return function(candidate) {
        if (parameters.activationDate < Date.now()) {
          candidate.clearUpdates();
        }
        return candidate;
      };
    },
    parametersDefinitions: [
      exports.parametersDefinitions.branch(),
      exports.parametersDefinitions.ip(),
      exports.parametersDefinitions.lastNumber()
    ]
  };
};

exports.predicates.productEquals = function()  {
  return {
    id: 'productEquals',
    summary: 'product equals',
    description: 'true if product matches with candidate',
    predicate: function(candidate, parameters) {
      return (candidate.product === parameters.product);
    },
    parametersDefinitions: [
      exports.parametersDefinitions.product()
    ]
  };
};

exports.predicates.activation = function() {
  return {
    id: 'activation',
    summary: 'Activation',
    description: 'true if activationDate matches now()',
    predicate: function(candidate, parameters) {
      return (Date.now() > parameters.activationDate);
    },
    parametersDefinitions: [
      exports.parametersDefinitions.activationDate()
    ]
  };
};
