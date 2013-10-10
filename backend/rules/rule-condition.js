'use strict';

var RuleParameterDefinition = require('./rule-parameter-definition');

var RuleCondition = function(object) {
  this.summary = object.summary;
  this.description = object.description;
  this.predicate = object.predicate;
  this.parametersDefinitions = [];
  if (object.parametersDefinitions) {
    object.parametersDefinitions.forEach(function(paramDef) {
        this.parametersDefinitions.push(new RuleParameterDefinition(paramDef));
    }.bind(this));
  }
};

RuleCondition.prototype.for = function(parameters) {
  return function(candidate) {
    return this.predicate(candidate, parameters);
  }.bind(this);
};

var branchLesserOrEqual = new RuleCondition({
  summary : 'lesser or equal than branch',
  description : '',
  predicate : function(candidate, parameters) {
    if (candidate.branch < parameters.branch) {
      return true;
    } else {
      return false;
    }
  },
  parametersDefinitions : [ new RuleParameterDefinition({
    id : 'branch',
    summary : 'version branch',
    description : 'a Mozilla product version branch',
    type : 'number',
    mandatory : true
  })]
});

module.exports = { branchLesserOrEqual : branchLesserOrEqual, RuleCondition : RuleCondition };
