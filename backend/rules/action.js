'use strict';

var ParameterDefinition = require('./parameter-definition');

var Action = function(object) {
  this.id = object.id;
  this.summary = object.summary;
  this.description = object.description;
  this.action = object.action;
  this.parametersDefinitions = [];
  if (object.parametersDefinitions) {
    object.parametersDefinitions.forEach(function(paramDef) {
        this.parametersDefinitions.push(new ParameterDefinition(paramDef));
    }.bind(this));
  }
};

Action.prototype.for = function (parameters) {
  return this.action(parameters);
};

module.exports = Action;
