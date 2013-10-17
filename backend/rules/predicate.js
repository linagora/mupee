'use strict';

var ParameterDefinition = require('./parameter-definition');

var Predicate = function(object) {
  this.id = object.id;
  this.summary = object.summary;
  this.description = object.description;
  this.predicate = object.predicate;
  this.parametersDefinitions = [];
  if (object.parametersDefinitions) {
    object.parametersDefinitions.forEach(function(paramDef) {
        this.parametersDefinitions.push(new ParameterDefinition(paramDef));
    }.bind(this));
  }
};

Predicate.prototype.for = function(parameters) {
  return function(candidate) {
    return this.predicate(candidate, parameters);
  }.bind(this);
};

module.exports = Predicate;
