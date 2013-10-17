'use strict';

var RuleParameterDefinition = require('./rule-parameter-definition');

var RuleAction = function(object) {
  this.id = object.id;
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

module.exports = RuleAction;
