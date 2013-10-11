'use strict';

var RuleParameterDefinition = require('./rule-parameter-definition');

var RuleCondition = function(object) {
  this.id = object.id;
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

module.exports = RuleCondition;
