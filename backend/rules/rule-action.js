'use strict';

var RuleParameterDefinition = require('./rule-parameter-definition');

var RuleAction = function(object) {
  this.summary = object.summary;
  this.description = object.description;
  this.action = object.action;
  this.parametersDefinitions = [];
  if (object.parametersDefinitions) {
    object.parametersDefinitions.forEach(function(paramDef) {
        this.parametersDefinitions.push(new RuleParameterDefinition(paramDef));
    }.bind(this));
  }
};

RuleAction.prototype.for = function (parameters) {
  return this.action(parameters);
};

var filterLatest = new RuleAction({
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
  parametersDefinition : new RuleParameterDefinition({
    id : 'version-type',
    summary : 'version type',
    description : 'a Mozilla product version type (major/minor)',
    type : 'string',
    mandatory : false,
    defaultValue : 'minor'
  })
});

module.exports = { RuleAction : RuleAction, filterLatest : filterLatest };
